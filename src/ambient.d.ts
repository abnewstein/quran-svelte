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
		number: number;
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

	export interface TranslationMetadata {
		name: string;
		translator?: string;
		language: string;
	}

	export interface Translation {
		metadata: TranslationMetadata;
		verses: Verse[][];
	}	

	/** StringFormat = `${chapterNumber}:${verseNumber}:${noteNumber}` */
	export type VerseNoteKey = `${number}:${number}:${number}`;

	export interface SearchResult {
		query: string;
		chapters: Chapter[];
		translations: Translation[];
		currentPage?: number;
		totalPages?: number;
	}
}

declare namespace svelteHTML {
	import type { AttributifyAttributes } from '@unocss/preset-attributify';

	type HTMLAttributes = AttributifyAttributes;
}
