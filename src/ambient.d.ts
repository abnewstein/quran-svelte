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

	export interface Verse {
		id: number;
		chapterNumber?: number;
		verseNumber?: number;
		text: string;
	}

	export interface TranslationMetadata {
		name: string;
		translator: string;
		language: string;
	}

	export interface Translation {
		metadata: TranslationMetadata;
		verses: Verse[][];
		notes?: Note[][];
	}

	type NoteDetails = {
		number: number;
		text: string;
		index: number;
	};

	export interface Note {
		chapterNumber: number;
		verseNumber: number;
		noteDetails: NoteDetails[];
	}

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
