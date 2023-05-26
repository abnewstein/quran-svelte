import { writable, derived } from 'svelte/store';
import chaptersData from './data/chapters-data.json';
import versesArOriginal from './data/verses_ar_original.json';
import versesEnSamGerrans from './data/verses_en_sam-gerrans.json';
import notesEnSamGerrans from './data/notes_en_sam-gerrans.json';

export enum TranslationEnum {
	ARABIC_ORIGINAL = 'ar-original',
	ENGLISH_SAM_GERRANS = 'en-sam-gerrans'
	// Add more translations here
}

const translationsMetadata: { [key in TranslationEnum]: Quran.TranslationMetadata } = {
	[TranslationEnum.ARABIC_ORIGINAL]: { name: 'Arabic Original', translator: '', language: 'ar' },
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		name: 'English - Sam Gerrans',
		translator: 'Sam Gerrans',
		language: 'en'
	}
	// Add more translations metadata here
};

// Group the verses by chapter number
const groupVersesByChapter = (verses: Quran.Verse[]): Quran.Verse[][] => {
	const groupedVerses: Quran.Verse[][] = [];

	verses.forEach((verse) => {
		if (verse.chapterNumber !== undefined) {
			const { chapterNumber, ...rest } = verse;
			if (!groupedVerses[chapterNumber - 1]) {
				groupedVerses[chapterNumber - 1] = [];
			}
			groupedVerses[chapterNumber - 1].push(rest);
		}
	});

	return groupedVerses;
};

const notesDataFormatted = (notes: any[][]): Quran.Note[] => {
	const notesFormatted: Quran.Note[] = [];

	notes.forEach((note) => {
		const [chapterNumber , verseNumber, noteNumber, noteText, noteCoords] = note;
		const noteFormatted: Quran.Note = {
			chapterNumber,
			verseNumber,
			notesDetails: [
				{
					number: noteNumber,
					text: noteText,
					index: noteCoords
				}
			]
		};

		const existingNote = notesFormatted.find(
			(note) => note.chapterNumber === chapterNumber && note.verseNumber === verseNumber
		);

		if (existingNote) {
			existingNote.notesDetails.push(noteFormatted.notesDetails[0]);
		} else {
			notesFormatted.push(noteFormatted);
		}
	});

	return notesFormatted;
};

// Prepare translations data
const translationsData: Record<TranslationEnum, Quran.Translation> = {
	[TranslationEnum.ARABIC_ORIGINAL]: {
		metadata: translationsMetadata[TranslationEnum.ARABIC_ORIGINAL],
		verses: groupVersesByChapter(versesArOriginal)
	},
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		metadata: translationsMetadata[TranslationEnum.ENGLISH_SAM_GERRANS],
		verses: groupVersesByChapter(versesEnSamGerrans),
		notes: notesDataFormatted(notesEnSamGerrans) // Include notes here
	}
	// Add more translations here
};

const _quranDataStore = writable({
	chapters: chaptersData,
	translations: translationsData
});

export const quranDataStore = {
	subscribe: _quranDataStore.subscribe,

	chapters: derived(_quranDataStore, ($store) => $store.chapters),

	getChapter: derived(_quranDataStore, ($store) => (chapterNumber: number): Quran.Chapter =>	
		$store.chapters.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter
		),

	getVersesAr: derived(_quranDataStore, ($store) => (chapterNumber: number): Quran.Verse[] =>
		$store.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1]
	),

	getVersesEn: derived(_quranDataStore, ($store) => (chapterNumber: number): Quran.Verse[] =>
		$store.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1]
	),

	getFirstVersePair: derived(_quranDataStore, ($store) => {
			const firstVerseAr =
				$store.translations[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0];
			const firstVerseEn =
				$store.translations[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0];

			return {
				ar: firstVerseAr,
				en: firstVerseEn
			};
		})
};
