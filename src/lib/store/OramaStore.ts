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
		search: async (id: VerseDb, query: string): Promise<Quran.VersePair[]> => {
			const db = state[id];
			if (!db) {
				return [];
			}
			const results = await search(db, { term: query, limit: 200, sortBy: { property: 'id' } });
			const verses = results.hits
				.map((hit) => {
					const [chapterNumber, verseNumber] = hit.id.split(':').map(Number);
					return QuranStore.getVerse(chapterNumber, verseNumber);
				})
				.sort((a, b) => a.ar.id - b.ar.id);
			return verses;
		}
	};
}

export const OramaStore = createOramaStore();
