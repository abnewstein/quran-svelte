import fs from 'fs';
import { create, insertMultiple, count, save } from '@orama/orama';
import { stemmer as stemmerAr } from '@orama/stemmers/arabic';
import { VerseDb } from '../lib/store/OramaStore.js';
import versesArOriginal from '../lib/data/verses_ar_original.json' assert { type: 'json' };
import versesEnSamGerrans from '../lib/data/verses_en_sam-gerrans.json' assert { type: 'json' };

const cleanUpVerse = (
	[chapterNumber, verseNumber, text]: (string | number)[],
	verseId: number
): Quran.Verse => {
	let verseText = text as string;
	verseText = verseText.replace(/<[^>]*>?/gm, '');

	return {
		id: verseId,
		chapterNumber: Number(chapterNumber),
		verseNumber: Number(verseNumber),
		text: verseText
	};
};

/**
 *
 * @param {string} id The id of the database
 * @param {Quran.Verse[]} verses The verses to be stored in the database
 * @returns OramaDb instance
 */
const createOramaSearchDb = async (id: VerseDb, verses: Quran.Verse[]) => {
	console.log('createOramaSearchDb started ', id, verses.length);
	console.time(`createVersesDb ${id}`);

	const verseDb = await create({
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

	const verseDocs = verses.map((verse) => ({
		id: verse.id + '',
		text: verse.cleanText || verse.text
	}));
	if ((await count(verseDb)) == 0) {
		await insertMultiple(verseDb, verseDocs);
	}

	// save the index to file
	const index = JSON.stringify(await save(verseDb));

	// save the translations data to a file
	try {
		fs.writeFileSync(`../lib/data/compiled/verses_${id}_orama_index.json`, index, {
			encoding: 'utf8',
			flag: 'a+'
		});
	} catch (err) {
		console.error(err);
	}

	console.timeEnd(`createVersesDb ${id}`);
	return verseDb;
};

// create the search indices
const arOriginalVerses = versesArOriginal.map(cleanUpVerse);
const enSamGerransVerses = versesEnSamGerrans.map(cleanUpVerse);

await createOramaSearchDb(VerseDb.ArOriginal, arOriginalVerses);
await createOramaSearchDb(VerseDb.EnSamGerrans, enSamGerransVerses);

console.log('createOramaIndex finished');
