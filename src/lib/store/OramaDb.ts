// import { create, insertMultiple, count } from '@orama/orama';
import versesArOriginal from '../data/verses_ar_original.json';
import versesEnSamGerrans from '../data/verses_en_sam-gerrans.json';

const createVersesDb = async (verses: (string | number)[][]) => {
	// console.time('Verse indexing in orama');
	// const verseDb = await create({
	// 	schema: {
	// 		chapterNumber: 'number',
	// 		verseNumber: 'number',
	// 		text: 'string'
	// 	}
	// });
	// const verseDocs = verses.map((verse: (string | number)[]) => ({
	// 	chapterNumber: verse[0] as number,
	// 	verseNumber: verse[1] as number,
	// 	text: verse[2] as string
	// }));
	// if ((await count(verseDb)) == 0) {
	// 	await insertMultiple(verseDb, verseDocs, 50);
	// }
	// console.timeEnd('Verse indexing in orama');
	// return verseDb;
	return null;
};

const verseArDb = createVersesDb(versesArOriginal);
const verseEnDb = createVersesDb(versesEnSamGerrans);

export default {
	verseArDb,
	verseEnDb
};
