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
	}

	export interface SearchResult {
		query: string;
		chapters: Chapter[];
		translations: Translation[];
		currentPage?: number;
		totalPages?: number;
	}
}