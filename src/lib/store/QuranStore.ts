import { readable } from 'svelte/store';
import chaptersData from '../data/chapters-data.json';
import { TranslationEnum, translationsData } from '../../scripts/DataFileParser';
import enSamGerransData from '../data/verses_en_sam-gerrans.json';

type QuranStoreState = {
	chapters: Quran.Chapter[];
	translations: Record<TranslationEnum, Quran.Translation>;
};

function createQuranStore() {
	const { subscribe } = readable<QuranStoreState>({
		chapters: chaptersData,
		translations: translationsData
	});

	let state: QuranStoreState;
	subscribe((v) => (state = v));

	return {
		subscribe,
		firstVersePair: {
			ar: translationsData[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0],
			en: translationsData[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0]
		} as Quran.VersePair,
		cleanVerses: [enSamGerransData],
		getChapter: (chapterNumber: number): Quran.Chapter =>
			state.chapters.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter,
		getVerse: (verseId: number): Quran.VersePair => {
			return {
				ar: state.translations[TranslationEnum.ARABIC_ORIGINAL].verses.flat()[verseId - 1],
				en: state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses.flat()[verseId - 1]
			} as Quran.VersePair;
		},
		getVerseAr: (chapterNumber: number, verseNumber: number): Quran.Verse =>
			state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1][
				verseNumber - 1
			],
		getVerseEn: (chapterNumber: number, verseNumber: number): Quran.Verse =>
			state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1][
				verseNumber - 1
			],
		getVersesAr: (chapterNumber: number): Quran.Verse[] =>
			state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1],
		getVersesEn: (chapterNumber: number): Quran.Verse[] =>
			state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1],
		getAllVersesAr: (): Quran.Verse[] =>
			state.translations[TranslationEnum.ARABIC_ORIGINAL].verses.flat(),
		getAllVersesEn: (): Quran.Verse[] =>
			state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses.flat()
	};
}

export const QuranStore = createQuranStore();
