
import versesArOriginal from '../data/verses_ar_original.json';
import versesEnSamGerrans from '../data/verses_en_sam-gerrans.json';
import versesEnSamGerransWithNotes from '../data/verses_en_sam-gerrans_with-notes.json';
import notesEnSamGerrans from '../data/notes_en_sam-gerrans.json';

export enum TranslationEnum {
	ARABIC_ORIGINAL = 'ar_original',
	ENGLISH_SAM_GERRANS = 'en_sam-gerrans'
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

// Group notes by chapter
const groupNotesByChapter = (notes: (string | number)[][]): Quran.Note[][] => {
    const notesByChapter: Quran.Note[][] = [];
    let currentChapterNumber = 1;
    let currentChapterNotes: Quran.Note[] = [];

    for(const [chapterNumber, verseNumber, noteNumber, noteText, noteIndex] of notes) {        
        if (chapterNumber !== currentChapterNumber) {
            notesByChapter.push(currentChapterNotes);
            currentChapterNumber = chapterNumber as number;
            currentChapterNotes = [];
        }

        currentChapterNotes.push({
            chapterNumber: Number(chapterNumber),
            verseNumber: Number(verseNumber),
            noteDetails: [
                {
                    number: Number(noteNumber),
                    text: noteText as string,
                    index: Number(noteIndex)
                }
            ]
        });
    }

    notesByChapter.push(currentChapterNotes);

    return notesByChapter;
};

const groupVersesByChapter = (verses: (string | number)[][]): Quran.Verse[][] => {
	const versesByChapter: Quran.Verse[][] = [];
	let currentChapterNumber = 1;
	let currentChapterVerses: Quran.Verse[] = [];

	let verseId = 1;
	for(const [chapterNumber, verseNumber, text] of verses) {		
		if (chapterNumber !== currentChapterNumber) {
			versesByChapter.push(currentChapterVerses);
			currentChapterNumber = chapterNumber as number;
			currentChapterVerses = [];
		}

		currentChapterVerses.push({
			id: Number(verseId++),
			chapterNumber: Number(chapterNumber),
			verseNumber: Number(verseNumber),
			text: text as string
		});
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
		verses: groupVersesByChapter(versesEnSamGerransWithNotes),
        notes: groupNotesByChapter(notesEnSamGerrans)
	}
	// Add more translations here
};