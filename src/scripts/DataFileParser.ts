import versesArOriginal from '../lib/data/verses_ar_original.json';
import versesEnSamGerransWithNotes from '../lib/data/verses_en_sam-gerrans_with-notes.json';
import notesEnSamGerrans from '../lib/data/notes_en_sam-gerrans.json';
import { createChapterVerseKey, createVerseNoteKey } from '$lib/utils/VerseKeyUtils.js';

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

const NOTE_REF_REGEX = /^\d+:\d+:\d+$/;
const ANCHOR_TAG_SIMPLE_REGEX = /<a>(\d+):(\d+)<\/a>/g;
const ANCHOR_TAG_RANGE_REGEX = /<a>(\d+):(\d+)-(\d+)<\/a>/g;

const replaceAnchorTags = (noteText: string) => {
	noteText = noteText.replace(ANCHOR_TAG_SIMPLE_REGEX, `<a href="/chapter/$1?verse=$2">$1:$2</a>`);
	return noteText.replace(ANCHOR_TAG_RANGE_REGEX, `<a href="/chapter/$1?verse=$2-$3">$1:$2-$3</a>`);
};

const processNoteText = (noteText: string) => replaceAnchorTags(noteText);

const createNotesLookup = (notes: (string | number)[][]): Record<string, Quran.NoteDetails> => {
	const notesLookup: Record<string, Quran.NoteDetails> = {};

	for (const note of notes) {
		const [chapterNumber, verseNumber, noteNumber] = note[0].toString().split(':');
		const verseNoteKey = createVerseNoteKey(chapterNumber, verseNumber, noteNumber);
		const chapterVerseKey = createChapterVerseKey(chapterNumber, verseNumber);
		if (!notesLookup[chapterVerseKey]) {
			notesLookup[chapterVerseKey] = [];
		}

		let noteText = note[1] as string;
		if (noteText.match(NOTE_REF_REGEX) !== null) {
			const [chapterNumber, verseNumber, noteNumber] = noteText.split(':');
			noteText =
				notesLookup[createChapterVerseKey(chapterNumber, verseNumber)][Number(noteNumber) - 1].text;
		}

		// noteText = processNoteText(noteText);

		notesLookup[chapterVerseKey].push({
			id: verseNoteKey,
			text: noteText
		});
	}
	return notesLookup;
};

const translationsResources = {
	[TranslationEnum.ARABIC_ORIGINAL]: {
		verses: versesArOriginal,
		notes: []
	},
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		verses: versesEnSamGerransWithNotes,
		notes: notesEnSamGerrans
	}
};

const formatVerse = (
	[chapterNumber, verseNumber, text]: (string | number)[],
	verseId: number,
	verseNotes: Quran.NoteDetails
): Quran.Verse => {
	let verseText = text as string;
	const verseNoteIdPrefix = `verse-note-link-${chapterNumber}:${verseNumber}`;
	verseText = verseText.replace(
		/<sup>(.*?)<\/sup>/g,
		`<sup class="verse-note"><button id="${verseNoteIdPrefix}:$1">$1</button></sup>`
	);

	return {
		id: verseId,
		chapterNumber: Number(chapterNumber),
		verseNumber: Number(verseNumber),
		text: verseText,
		notes: verseNotes
	};
};

const groupVersesByChapter = (
	verses: (string | number)[][],
	notesLookup: Record<string, Quran.NoteDetails>
): Quran.Verse[][] => {
	const versesByChapter: Quran.Verse[][] = [];
	let currentChapterNumber = 1;
	let currentChapterVerses: Quran.Verse[] = [];
	let verseId = 1;

	for (const verse of verses) {
		const [chapterNumber, verseNumber] = verse as [number, number];
		if (chapterNumber !== currentChapterNumber) {
			versesByChapter.push(currentChapterVerses);
			currentChapterNumber = chapterNumber;
			currentChapterVerses = [];
		}
		const verseNotes =
			notesLookup[`${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey] || [];
		currentChapterVerses.push(formatVerse(verse, verseId++, verseNotes));
	}

	versesByChapter.push(currentChapterVerses);
	return versesByChapter;
};

function loadTranslationData(translation: TranslationEnum): Quran.Verse[][] {
	if (!translationsResources[translation]) {
		throw new Error(`Translation ${translation} not found`);
	}

	const { verses, notes } = translationsResources[translation];
	const notesLookup = createNotesLookup(notes);

	return groupVersesByChapter(verses, notesLookup);
}

// Prepare translations data
export const translationsData: Record<TranslationEnum, Quran.Translation> = {
	[TranslationEnum.ARABIC_ORIGINAL]: {
		metadata: translationsMetadata[TranslationEnum.ARABIC_ORIGINAL],
		verses: loadTranslationData(TranslationEnum.ARABIC_ORIGINAL)
	},
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		metadata: translationsMetadata[TranslationEnum.ENGLISH_SAM_GERRANS],
		verses: loadTranslationData(TranslationEnum.ENGLISH_SAM_GERRANS)
	}
	// Add more translations here
};
