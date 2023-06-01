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
	[TranslationEnum.ARABIC_ORIGINAL]: { name: 'Arabic Original', language: 'ar' },
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		name: 'English - Sam Gerrans',
		translator: 'Sam Gerrans',
		language: 'en'
	}
	// Add more translations metadata here
};

type ChapterVerseKey = string;

const createNotesLookup = (notes: (string | number)[][]): Record<ChapterVerseKey, Quran.NoteDetails> => {
	const notesLookup: Record<ChapterVerseKey, Quran.NoteDetails> = {};

	for (const note of notes) {
		const chapterVerseKey = `${note[0]}-${note[1]}`;
		if (!notesLookup[chapterVerseKey]) {
			notesLookup[chapterVerseKey] = [];
		}

		notesLookup[chapterVerseKey].push({
			number: note[2] as number,
			text: note[3] as string
		});
	}

	return notesLookup;
};

const formatVerse = ([chapterNumber, verseNumber, text]: (string | number)[], verseId: number, verseNotes: Quran.NoteDetails): Quran.Verse => {
	let verseText = text as string;
	verseText = verseText.replace(
		/<sup>(.*?)<\/sup>/g,
		`<sup class="verse-note"><a href="#" class="verse-note-link">$1</a></sup>`
	);	

	return {
		id: verseId,
		chapterNumber: Number(chapterNumber),
		verseNumber: Number(verseNumber),
		text: verseText,
		notes: verseNotes
	};
};

const groupVersesByChapter = (verses: (string | number)[][], notesLookup: Record<ChapterVerseKey, Quran.NoteDetails>): Quran.Verse[][] => {
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
		const verseNotes = notesLookup[`${verse[0]}-${verse[1]}`] || [];
		currentChapterVerses.push(formatVerse(verse, verseId++, verseNotes));
	}

	versesByChapter.push(currentChapterVerses);		
	return versesByChapter;
};

// Prepare translations data
const notesLookup = createNotesLookup(notesEnSamGerrans);
export const translationsData: Record<TranslationEnum, Quran.Translation> = {
	[TranslationEnum.ARABIC_ORIGINAL]: {
		metadata: translationsMetadata[TranslationEnum.ARABIC_ORIGINAL],
		verses: groupVersesByChapter(versesArOriginal, {})
	},
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		metadata: translationsMetadata[TranslationEnum.ENGLISH_SAM_GERRANS],
		verses: groupVersesByChapter(versesEnSamGerransWithNotes, notesLookup),
	}
	// Add more translations here
};
