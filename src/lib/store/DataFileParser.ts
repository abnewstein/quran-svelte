import versesArOriginal from '../data/verses_ar_original.json';
import versesEnSamGerransWithNotes from '../data/verses_en_sam-gerrans_with-notes.json';
import notesEnSamGerrans from '../data/notes_en_sam-gerrans.json';

export enum TranslationEnum {
	ARABIC_ORIGINAL = 'ar_original',
	ENGLISH_SAM_GERRANS = 'en_sam-gerrans'
	// Add more translations here
}

// Contains metadata for all translations
const translationsMetadata: { [key in TranslationEnum]: Quran.TranslationMetadata } = {
	[TranslationEnum.ARABIC_ORIGINAL]: { name: 'Arabic Original', translator: '', language: 'ar' },
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		name: 'English - Sam Gerrans',
		translator: 'Sam Gerrans',
		language: 'en'
	}
	// Add more translations metadata here
};

const formatNote = ([chapterNumber, verseNumber, noteNumber, noteText]: (string | number)[]): Quran.Note => {
	return {
		chapterNumber: Number(chapterNumber),
		verseNumber: Number(verseNumber),
		noteDetails: [
			{
				number: Number(noteNumber),
				text: noteText as string,
			}
		]
	};
};

const groupNotesByChapter = (notes: (string | number)[][]): Quran.Note[][] => {
	const notesByChapter: Quran.Note[][] = [];
	let currentChapterNumber = 1;
	let currentChapterNotes: Quran.Note[] = [];

	for (const note of notes) {
		if (note[0] !== currentChapterNumber) {
			notesByChapter.push(currentChapterNotes);
			currentChapterNumber = note[0] as number;
			currentChapterNotes = [];
		}

		currentChapterNotes.push(formatNote(note));
	}

	notesByChapter.push(currentChapterNotes);

	return notesByChapter;
};

const formatVerse = ([chapterNumber, verseNumber, text]: (string | number)[], verseId: number, withNotes = false): Quran.Verse => {
	let verseText = text as string;

	if (withNotes) {
		verseText = verseText.replace(
			/<sup>(.*?)<\/sup>/g,
			`<sup class="verse-note"><button class="verse-note-button" data-chapter-num="${chapterNumber}" data-verse-num="${verseNumber}">$1</button></sup>`
		);
	}

	return {
		id: verseId,
		chapterNumber: Number(chapterNumber),
		verseNumber: Number(verseNumber),
		text: verseText
	};
};

const groupVersesByChapter = (verses: (string | number)[][], withNotes = false): Quran.Verse[][] => {
	const versesByChapter: Quran.Verse[][] = [];
	let currentChapterNumber = 1;
	let currentChapterVerses: Quran.Verse[] = [];
	let verseId = 1;

	for (const verse of verses) {
		if (verse[0] !== currentChapterNumber) {
			versesByChapter.push(currentChapterVerses);
			currentChapterNumber = verse[0] as number;
			currentChapterVerses = [];
		}

		currentChapterVerses.push(formatVerse(verse, verseId++, withNotes));
	}

	versesByChapter.push(currentChapterVerses);
	return versesByChapter;
};

// Prepare translations data
export const translationsData: Record<TranslationEnum, Quran.Translation> = {
	[TranslationEnum.ARABIC_ORIGINAL]: {
		metadata: translationsMetadata[TranslationEnum.ARABIC_ORIGINAL],
		verses: groupVersesByChapter(versesArOriginal)
	},
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		metadata: translationsMetadata[TranslationEnum.ENGLISH_SAM_GERRANS],
		verses: groupVersesByChapter(versesEnSamGerransWithNotes, true),
		notes: groupNotesByChapter(notesEnSamGerrans)
	}
	// Add more translations here
};
