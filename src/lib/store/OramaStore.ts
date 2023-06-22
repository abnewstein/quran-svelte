import {
	create,
	insertMultiple,
	count,
	search,
	type ProvidedTypes,
	type Orama
} from '@orama/orama';
import { writable } from 'svelte/store';
import { QuranStore } from './QuranStore';

/**
 *
 * @param {string} id The id of the database
 * @param {Quran.Verse[]} verses The verses to be stored in the database
 * @returns OramaDb instance
 */
export const createOramaSearchDb = async (id: VerseDb, verses: Quran.Verse[]) => {
	console.log('createOramaSearchDb started ', id, verses.length);
	console.time(`createVersesDb ${id}`);
	const verseDb = await create({
		schema: {
			id: 'string',
			text: 'string'
		},
		id
	});
	const verseDocs = verses.map((verse: Quran.Verse) => ({
		id: verse.id + '',
		text: verse.cleanText || verse.text
	}));
	if ((await count(verseDb)) == 0) {
		await insertMultiple(verseDb, verseDocs, 50);
	}
	console.timeEnd(`createVersesDb ${id}`);
	return verseDb;
};

export enum VerseDb {
	ArOriginal = 'arOriginal',
	EnSamGerrans = 'enSamGerrans'
}

type OramaStoreState = Record<VerseDb, Orama<ProvidedTypes> | null>;

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
		initDB: async (id: VerseDb, verses: Quran.Verse[]) => {
			const db = await createOramaSearchDb(id, verses);
			update((s) => ({ ...s, [id]: db }));
		},
		isReady: async () => {
			const isArOriginalReady = state.arOriginal ? (await count(state.arOriginal)) === 6236 : false;
			const isEnSamGerransReady = state.enSamGerrans
				? (await count(state.enSamGerrans)) === 6236
				: false;
			return isArOriginalReady && isEnSamGerransReady;
		},
		get: (id: VerseDb) => state[id],
		search: async (id: VerseDb, query: string): Promise<Quran.VersePair[]> => {
			const db = state[id];
			if (!db) return [];
			const results = await search(db, { term: query, limit: 10 });
			const verses = results.hits.map((hit) => QuranStore.getVerse(hit.document.id as number));
			return verses;
		}
	};
}

export const OramaStore = createOramaStore();
