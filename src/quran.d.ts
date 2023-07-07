declare namespace Quran {
	export interface Chapter {
		number: number;
		name: {
			arabic: string;
			transliteration: string;
			english: string;
		};
		versesCount: number;
	}

	/** StringFormat = `${chapterNumber}:${verseNumber}` */
	export type ChapterVerseKey = `${number}:${number}`;

	/** StringFormat = `${chapterNumber}:${verseNumber}:${noteNumber}` */
	export type VerseNoteKey = `${number}:${number | '*'}:${number | '*'}`;

	export type VerseRange = `${number}-${number}` | number;

	export interface NoteDetail {
		id: VerseNoteKey;
		text: string;
	}

	type NoteDetails = NoteDetail[];

	export interface Verse {
		id: number;
		chapterNumber: number;
		verseNumber: number;
		text: string;
		notes?: NoteDetails;
	}

	export interface VersePair {
		ar: Verse;
		en: Verse;
	}

	export interface TranslationMetadata {
		name: string;
		translator?: string;
		language: string;
	}

	export interface Translation {
		metadata: TranslationMetadata;
		verses: Verse[][];
	}

	export interface SearchResult {
		query: string;
		chapters: Chapter[];
		verses: VersePair[];
		chapterCount: number;
		verseCount: number;
	}
}
