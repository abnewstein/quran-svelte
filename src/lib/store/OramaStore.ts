import {
	create,
	count,
	search,
	type ProvidedTypes,
	type Orama,
	load,
	type RawData
} from '@orama/orama';
import { stemmer as stemmerAr } from '@orama/stemmers/arabic';
import versesOramaArIndex from '../data/compiled/verses_ar_original_orama_index.json' assert { type: 'json' };
import versesOramaEnIndex from '../data/compiled/verses_en_sam-gerrans_orama_index.json' assert { type: 'json' };

import { writable } from 'svelte/store';
import { QuranStore } from './QuranStore.js';

export enum VerseDb {
	ArOriginal = 'ar_original',
	EnSamGerrans = 'en_sam-gerrans'
}

type OramaStoreState = Record<VerseDb, Orama<ProvidedTypes> | null>;

const createVerseDb = async (id: VerseDb) =>
	await create({
		schema: {
			id: 'string',
			text: 'string'
		},
		components: {
			tokenizer: {
				language: id === VerseDb.ArOriginal ? 'arabic' : 'english',
				stemming: true,
				stemmer: id === VerseDb.ArOriginal ? stemmerAr : undefined
			}
		},
		id
	});

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
		load: async (id: VerseDb) => {
			if (state[id]) return;
			const db = await createVerseDb(id);
			const rawData = id === VerseDb.ArOriginal ? versesOramaArIndex : versesOramaEnIndex;
			await load(db, rawData as RawData);
			update((s) => ({ ...s, [id]: db }));
		},
		isReady: async () => {
			const isArOriginalReady = state[VerseDb.ArOriginal]
				? (await count(state[VerseDb.ArOriginal])) === 6236
				: false;
			const isEnSamGerransReady = state[VerseDb.EnSamGerrans]
				? (await count(state[VerseDb.EnSamGerrans])) === 6236
				: false;
			return isArOriginalReady && isEnSamGerransReady;
		},
		get: (id: VerseDb) => state[id],
		search: async (id: VerseDb, query: string): Promise<Quran.VersePair[]> => {
			const db = state[id];
			if (!db) return [];
			const results = await search(db, { term: query, limit: 100, sortBy: { property: 'id' } });
			const verses = results.hits.map((hit) => QuranStore.getVerse(hit.document.id as number));
			return verses;
		}
	};
}

export const OramaStore = createOramaStore();
