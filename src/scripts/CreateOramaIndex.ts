import path from 'path';
import fs from 'fs';
import { create, insertMultiple, count, save } from '@orama/orama';
import { stemmer as stemmerAr } from '@orama/stemmers/arabic';
import { VerseDb } from '../lib/store/OramaStore.js';
import versesArOriginal from '../lib/data/verses_ar_original.json' assert { type: 'json' };
import versesEnSamGerrans from '../lib/data/verses_en_sam-gerrans.json' assert { type: 'json' };

type Verse = {
	id: string;
	text: string;
};
const cleanUpVerse = ([chapterNumber, verseNumber, text]: (string | number)[]): Verse => {
	let verseText = text as string;
	verseText = verseText.replace(/<[^>]*>?/gm, '');
	return {
		id: `${chapterNumber}:${verseNumber}`,
		text: verseText
	};
};

const createOramaSearchDb = async (dbId: VerseDb, verses: Verse[]) => {
	console.log('createOramaSearchDb started ', dbId, verses.length);
	console.time(`createVersesDb ${dbId}`);

	const verseDb = await create({
		schema: {
			id: 'string',
			text: 'string'
		},
		components: {
			tokenizer: {
				language: dbId === VerseDb.ArOriginal ? 'arabic' : 'english',
				stemming: true,
				stemmer: dbId === VerseDb.ArOriginal ? stemmerAr : undefined
			}
		},
		id: dbId
	});

	const verseDocs = verses.map((verse) => ({
		id: verse.id + '',
		text: verse.text
	}));
	if ((await count(verseDb)) == 0) {
		await insertMultiple(verseDb, verseDocs);
	}

	// save the index to file
	const index = JSON.stringify(await save(verseDb));

	// save the translations data to a file
	try {
		const dirname = path.dirname(new URL(import.meta.url).pathname);
		const filePath = path.join(dirname, `../lib/data/compiled/search_index_${dbId}.json`);
		fs.writeFileSync(filePath.slice(1), index, {
			encoding: 'utf8',
			flag: 'w+'
		});

		console.log(`Saved index to file for ${dbId}`);
	} catch (err) {
		console.error(`Failed to write index to file for ${dbId}`, err);
	}

	console.timeEnd(`createVersesDb ${dbId}`);
	return verseDb;
};

const createSearchDatabases = async () => {
	try {
		// create the search indices
		const arOriginalVerses = versesArOriginal.map((verse) => cleanUpVerse(verse));
		const enSamGerransVerses = versesEnSamGerrans.map((verse) => cleanUpVerse(verse));

		await Promise.all([
			await createOramaSearchDb(VerseDb.ArOriginal, arOriginalVerses),
			await createOramaSearchDb(VerseDb.EnSamGerrans, enSamGerransVerses)
		]);

		console.log('createOramaIndex finished');
	} catch (err) {
		console.error('Failed to create search databases', err);
	}
};

createSearchDatabases();
