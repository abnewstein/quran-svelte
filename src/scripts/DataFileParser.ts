import versesArOriginal from '../lib/data/verses_ar_original.json';
import versesEnSamGerransWithNotes from '../lib/data/verses_en_sam-gerrans_with-notes.json';
import notesEnSamGerrans from '../lib/data/notes_en_sam-gerrans.json';

console.time('Data Files parsing');
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

const createNotesLookup = (notes: (string | number)[][]): Record<string, Quran.NoteDetails> => {
	const notesLookup: Record<string, Quran.NoteDetails> = {};

	for (const note of notes) {
		const [chapterNumber, verseNumber, noteNumber] = note[0].toString().split(':');
		const verseNoteKey = `${chapterNumber}:${verseNumber}:${noteNumber}` as Quran.VerseNoteKey;
		const chapterVerseKey = `${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey;
		if (!notesLookup[chapterVerseKey]) {
			notesLookup[chapterVerseKey] = [];
		}

		let noteText = note[1] as string;
		if (noteText.match(/^\d+:\d+:\d+$/) !== null) {
			const [chapterNumber, verseNumber, noteNumber] = noteText.split(':');
			noteText =
				notesLookup[`${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey][
					Number(noteNumber) - 1
				].text;
		}

		notesLookup[chapterVerseKey].push({
			id: verseNoteKey,
			text: noteText
		});
	}
	return notesLookup;
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
		cleanText: verseText.replace(/<[^>]*>?/gm, ''),
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
	let verses: (string | number)[][] = [];
	let notesLookup: Record<string, Quran.NoteDetails> = {};
	switch (translation) {
		case TranslationEnum.ARABIC_ORIGINAL:
			verses = versesArOriginal;
			break;
		case TranslationEnum.ENGLISH_SAM_GERRANS:
			verses = versesEnSamGerransWithNotes;
			notesLookup = createNotesLookup(notesEnSamGerrans);
			break;
		default:
			throw new Error(`Translation ${translation} not found`);
	}

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

console.timeEnd('Data Files parsing');
