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

const formatVerse = ([chapterNumber, verseNumber, text]: (string | number)[], verseId: number, verseNotes: (string | number)[][]): Quran.Verse => {
	let verseText = text as string;
	const notesRecord: Quran.NoteDetails = {};

	for (const note of verseNotes) {
		verseText = verseText.replace(
			/<sup>(.*?)<\/sup>/g,
			`<sup class="verse-note"><button class="verse-note-button" data-chapter-num="${chapterNumber}" data-verse-num="${verseNumber}">$1</button></sup>`
		);
		notesRecord[note[2] as number] = note[3] as string;
	}

	return {
		id: verseId,
		chapterNumber: Number(chapterNumber),
		verseNumber: Number(verseNumber),
		text: verseText,
		notes: notesRecord
	};
};

const groupVersesByChapter = (verses: (string | number)[][], notes: (string | number)[][]): Quran.Verse[][] => {
	const versesByChapter: Quran.Verse[][] = [];
	let currentChapterNumber = 1;
	let currentChapterVerses: Quran.Verse[] = [];
	let verseId = 1;

	for (const verse of verses) {
		const currentVerseNumber = Number(verse[1]);
		if (verse[0] !== currentChapterNumber) {
			versesByChapter.push(currentChapterVerses);
			currentChapterNumber = verse[0] as number;
			currentChapterVerses = [];
		}
		const verseNotes: (string | number)[][] = [];
		if(notes.length > 0){
		for (const note of notes) {
				if (note[0] === currentChapterNumber && note[1] === currentVerseNumber) {
					verseNotes.push(note);
				}
			}
		}		
		currentChapterVerses.push(formatVerse(verse, verseId++, verseNotes));
	}

	versesByChapter.push(currentChapterVerses);	
	return versesByChapter;
};

// Prepare translations data
export const translationsData: Record<TranslationEnum, Quran.Translation> = {
	[TranslationEnum.ARABIC_ORIGINAL]: {
		metadata: translationsMetadata[TranslationEnum.ARABIC_ORIGINAL],
		verses: groupVersesByChapter(versesArOriginal, [])
	},
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		metadata: translationsMetadata[TranslationEnum.ENGLISH_SAM_GERRANS],
		verses: groupVersesByChapter(versesEnSamGerransWithNotes, notesEnSamGerrans),
	}
	// Add more translations here
};
