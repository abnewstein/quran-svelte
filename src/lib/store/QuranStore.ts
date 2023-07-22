import { readable } from 'svelte/store';
import chaptersData from '$lib/data/chapters-data.json' assert { type: 'json' };
import { TranslationEnum, translationsData } from '../../scripts/DataFileParser.js';

type QuranStoreState = {
	chapters: Quran.Chapter[];
	translations: Record<TranslationEnum, Quran.Translation>;
};

function createQuranStore(): {
	subscribe: (
		run: (value: QuranStoreState) => void,
		invalidate?: (value?: QuranStoreState) => void
	) => () => void;
	getFirstVersePair: () => Quran.VersePair;
	getChapter: (chapterNumber: number) => Quran.Chapter;
	getVerse: (reference: QuranRef.Verse) => Quran.VersePair;
	getVerses: (reference: QuranRef.VerseRange) => Quran.VersePair[];
	getVersesByChapter: (chapterNumber: number) => Quran.VersePair[];
	getAllVerses: () => Quran.VersePair[];
} {
	const { subscribe } = readable<QuranStoreState>({
		chapters: chaptersData,
		translations: translationsData
	});

	let state: QuranStoreState;
	subscribe((v) => (state = v));

	return {
		subscribe,
		getFirstVersePair: (): Quran.VersePair => ({
			ar: state.translations[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0],
			en: state.translations[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0]
		}),
		getChapter: (chapterNumber: number): Quran.Chapter =>
			state.chapters.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter,
		getVerse: (reference: QuranRef.Verse): Quran.VersePair => {
			if (reference.type !== 'verse') throw new Error('Invalid QuranRef.Reference');

			const chapterIndex = reference.chapterNumber - 1;
			const verseIndex = reference.verseNumber ? reference.verseNumber - 1 : 0;

			return {
				ar: state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterIndex][verseIndex],
				en: state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterIndex][verseIndex]
			};
		},
		getVerses: (reference: QuranRef.VerseRange): Quran.VersePair[] => {
			const chapterIndex = reference.chapterNumber - 1;
			let verseStartIndex = 0,
				verseEndIndex = undefined;

			if (reference.type === 'verse') {
				verseStartIndex = reference.verseNumber ? reference.verseNumber - 1 : 0;
				verseEndIndex = verseStartIndex + 1;
			} else if (reference.type === 'range') {
				verseStartIndex = reference.verseStart - 1;
				verseEndIndex = reference.verseEnd;
			} else {
				throw new Error('Invalid QuranRef.Reference');
			}

			const versesAr = state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[
				chapterIndex
			].slice(verseStartIndex, verseEndIndex);
			const versesEn = state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[
				chapterIndex
			].slice(verseStartIndex, verseEndIndex);

			return versesAr.map((verse, index) => ({
				ar: verse,
				en: versesEn[index]
			}));
		},
		getVersesByChapter: (chapterNumber: number): Quran.VersePair[] => {
			const chapterIndex = chapterNumber - 1;
			const versesAr = state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterIndex];
			const versesEn = state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterIndex];

			return versesAr.map((verse, index) => ({
				ar: verse,
				en: versesEn[index]
			}));
		},
		getAllVerses: (): Quran.VersePair[] => {
			const versesAr = state.translations[TranslationEnum.ARABIC_ORIGINAL].verses.flat();
			const versesEn = state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses.flat();
			return versesAr.map((verse, index) => ({
				ar: verse,
				en: versesEn[index]
			}));
		}
	};
}

export const QuranStore = createQuranStore();
