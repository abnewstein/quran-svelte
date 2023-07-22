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

	export interface NoteDetail {
		id: string;
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

declare namespace QuranRef {
	export type Chapter = {
		type: 'chapter';
		chapterNumber: number;
	};

	export type Verse = {
		type: 'verse';
		chapterNumber: number;
		verseNumber: number;
	};

	export type Range = {
		type: 'range';
		chapterNumber: number;
		verseStart: number;
		verseEnd: number;
	};

	export type Note = {
		type: 'note';
		chapterNumber: number;
		verseNumber: number;
		noteNumber: number;
	};

	export type VerseRange = Verse | Range;

	export type Reference = Chapter | Verse | Range | Note;
}
