import { search, type ProvidedTypes, type Orama } from '@orama/orama';
import { writable } from 'svelte/store';
import { QuranStore } from './QuranStore.js';
import { createSearchDatabases } from '../utils/CreateOramaIndex.js';

export enum VerseDb {
	ArOriginal = 'ar_original',
	EnSamGerrans = 'en_sam-gerrans'
}

export type OramaStoreState = Record<VerseDb, Orama<ProvidedTypes> | null>;

function createOramaStore() {
	const { subscribe, set, update } = writable<OramaStoreState>({
		[VerseDb.ArOriginal]: null,
		[VerseDb.EnSamGerrans]: null
	});

	let state: OramaStoreState;
	subscribe((v) => (state = v));

	return {
		subscribe,
		set,
		update,
		init: async () => {
			OramaStore.set(await createSearchDatabases());
		},
		isReady: async () => {
			return state[VerseDb.ArOriginal] && state[VerseDb.EnSamGerrans];
		},
		get: (id: VerseDb) => state[id],
		search: async (query: string): Promise<Quran.SearchResult> => {
			const arDb = state[VerseDb.ArOriginal];
			const enDb = state[VerseDb.EnSamGerrans];
			const searchResult = {
				query,
				chapters: [],
				verses: [],
				chapterCount: 0,
				verseCount: 0
			} as Quran.SearchResult;

			if (!arDb || !enDb) {
				return searchResult;
			}

			// parse the query and decide which database to search

			const chaptersAr = await search(arDb, { term: query, limit: 114 });
			const chapterArIds = chaptersAr.hits.map((hit) => hit.id);
			const versesAr = await search(arDb, { term: query, limit: 200 });
			const verseArIds = versesAr.hits.map((hit) => hit.id);
			const chaptersEn = await search(enDb, { term: query, limit: 114 });
			const chapterEnIds = chaptersEn.hits.map((hit) => hit.id);
			const versesEn = await search(enDb, { term: query, limit: 200 });
			const verseEnIds = versesEn.hits.map((hit) => hit.id);

			// merge the chapter and verse ids
			const chapterIds = [...chapterArIds, ...chapterEnIds];
			const verseIds = [...verseArIds, ...verseEnIds];

			searchResult.chapters = chapterIds
				.map((id) => QuranStore.getChapter(Number(id)))
				.sort((a, b) => a.number - b.number);
			searchResult.verses = verseIds
				.map((id) => {
					const [chapterNumber, verseNumber] = id.split(':').map(Number);
					return QuranStore.getVerse(chapterNumber, verseNumber);
				})
				.sort((a, b) => a.ar.id - b.ar.id);
			searchResult.chapterCount = chapterIds.length;
			searchResult.verseCount = verseIds.length;

			return searchResult;
		}
	};
}

export const OramaStore = createOramaStore();
