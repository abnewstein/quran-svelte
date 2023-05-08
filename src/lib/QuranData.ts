import { writable } from 'svelte/store';
import chaptersData from './translations/chapters-data.json';
import versesArOriginal from './translations/verses-ar-original.json';
import versesEnSamGerrans from './translations/verses-en-sam-gerrans.json';

export enum TranslationEnum {
	ARABIC_ORIGINAL = 'ar-original',
	ENGLISH_SAM_GERRANS = 'en-sam-gerrans'
	// Add more translations here
}

const translationsMetadata: { [key: string]: Quran.TranslationMetadata } = {
	[TranslationEnum.ARABIC_ORIGINAL]: { name: 'Arabic Original', translator: '', language: 'ar' },
	[TranslationEnum.ENGLISH_SAM_GERRANS]: {
		name: 'English - Sam Gerrans',
		translator: 'Sam Gerrans',
		language: 'en'
	}
	// Add more translations metadata here
};

class QuranData {
	private static instance: QuranData;
	private chapters: Quran.Chapter[];
	private translations: { [translation: string]: Quran.Translation };

	private constructor(
		chaptersData: Quran.Chapter[],
		translationsData: { [translation: string]: Quran.Translation }
	) {
		this.chapters = chaptersData;
		this.translations = translationsData;
	}

	public static getInstance(): QuranData {
		if (!QuranData.instance) {
			// Transform the JSON data into the desired structure
			const translationsData: { [translation: string]: Quran.Translation } = {
				[TranslationEnum.ARABIC_ORIGINAL]: {
					metadata: translationsMetadata[TranslationEnum.ARABIC_ORIGINAL],
					verses: QuranData.groupVersesByChapter(versesArOriginal)
				},
				[TranslationEnum.ENGLISH_SAM_GERRANS]: {
					metadata: translationsMetadata[TranslationEnum.ENGLISH_SAM_GERRANS],
					verses: QuranData.groupVersesByChapter(versesEnSamGerrans)
				}
				// Add more translations here
			};

			QuranData.instance = new QuranData(chaptersData, translationsData);
		}
		return QuranData.instance;
	}

	private static groupVersesByChapter(verses: Quran.Verse[]): Quran.Verse[][] {
		const groupedVerses: Quran.Verse[][] = [];

		verses.forEach((verse) => {
			if (verse.chapterNumber !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { chapterNumber, verseNumber, ...rest } = verse;
				if (!groupedVerses[chapterNumber - 1]) {
					groupedVerses[chapterNumber - 1] = [];
				}
				groupedVerses[chapterNumber - 1].push(rest);
			}
		});

		return groupedVerses;
	}

	getChapters(): Quran.Chapter[] {
		return this.chapters;
	}

	getChapter(chapterNumber: number): Quran.Chapter | null {
		return this.chapters.find((chapter) => chapter.number === chapterNumber) || null;
	}

	getVerses(chapterNumber: number, translation: string): Quran.Verse[] {
		const translationData = this.translations[translation];
		if (!translationData) {
			throw new Error('Invalid translation specified');
		}
		return translationData.verses[chapterNumber - 1];
	}

	getVerse(chapterNumber: number, verseNumber: number, translation: string): Quran.Verse | null {
		const verses = this.getVerses(chapterNumber, translation);
		return verses[verseNumber - 1] || null;
	}
	getSearchResult(query: string, translation: string): Quran.SearchResult {
		// Implement your search logic here

		// Example:
		const chapters = this.chapters.filter((chapter) =>
			chapter.name.english.toLowerCase().includes(query.toLowerCase())
		);
		const translations: Quran.Translation[] = Object.keys(this.translations).map((key) => {
			const { metadata, verses } = this.translations[key];
			const filteredVerses = verses.map((chapterVerses) =>
				chapterVerses.filter((verse) => verse.text.toLowerCase().includes(query.toLowerCase()))
			);
			return { metadata, verses: filteredVerses };
		});

		return {
			query,
			chapters,
			translations
			// Optionally include currentPage and totalPages if you implement pagination
		};
	}
}

export const quranDataStore = writable<QuranData | null>(null);

quranDataStore.set(QuranData.getInstance());