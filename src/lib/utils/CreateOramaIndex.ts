import {
	create,
	insertMultiple,
	count,
	save,
	load,
	type ProvidedTypes,
	type Orama
} from '@orama/orama';
import localforage from 'localforage';
import { VerseDb, type OramaStoreState } from '../store/OramaStore.js';

type Verse = {
	id: string;
	text: string;
};

const cleanUpVerse = (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	[chapterNumber, verseNumber, text]: (string | number)[]
): Verse => {
	let verseText = text as string;
	verseText = verseText.replace(/<[^>]*>?/gm, '');
	return {
		id: `${chapterNumber}:${verseNumber}`,
		text: verseText
	};
};

export const createVerseDb = async (dbId: VerseDb) =>
	create({
		schema: {
			id: 'string',
			text: 'string'
		},
		id: dbId
	});

const createOramaSearchDb = async (verseDb: Orama<ProvidedTypes>, verses: Verse[]) => {
	const verseDocs = verses.map(({ id, text }) => ({ id, text }));
	if ((await count(verseDb)) == 0) {
		await insertMultiple(verseDb, verseDocs, 50);
	}
	return verseDb;
};

export const createSearchDatabases = async (): Promise<OramaStoreState> => {
	const state: OramaStoreState = {
		[VerseDb.ArOriginal]: null,
		[VerseDb.EnSamGerrans]: null
	};
	try {
		const arOriginalIndex = (await localforage.getItem(VerseDb.ArOriginal)) as string | null;
		const enSamGerransIndex = (await localforage.getItem(VerseDb.EnSamGerrans)) as string | null;

		const verseArDb = await createVerseDb(VerseDb.ArOriginal);
		const verseEnDb = await createVerseDb(VerseDb.EnSamGerrans);

		if (arOriginalIndex && enSamGerransIndex) {
			await load(verseArDb, JSON.parse(arOriginalIndex));
			await load(verseEnDb, JSON.parse(enSamGerransIndex));
			state[VerseDb.ArOriginal] = verseArDb;
			state[VerseDb.EnSamGerrans] = verseEnDb;
		} else {
			const versesArOriginal = (await import('../data/verses_ar_original.json')).default;
			const versesEnSamGerrans = (await import('../data/verses_en_sam-gerrans.json')).default;
			const arOriginalVerses = versesArOriginal.map(cleanUpVerse);
			const enSamGerransVerses = versesEnSamGerrans.map(cleanUpVerse);

			state[VerseDb.ArOriginal] = await createOramaSearchDb(verseArDb, arOriginalVerses);
			state[VerseDb.EnSamGerrans] = await createOramaSearchDb(verseEnDb, enSamGerransVerses);

			localforage.setItem(VerseDb.ArOriginal, JSON.stringify(await save(verseArDb)));
			localforage.setItem(VerseDb.EnSamGerrans, JSON.stringify(await save(verseEnDb)));
		}

		console.log('createOramaIndex finished');
	} catch (err) {
		console.error('Failed to create search databases', err);
	}
	return state;
};
