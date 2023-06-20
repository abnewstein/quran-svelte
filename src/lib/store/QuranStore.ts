import { readable } from 'svelte/store';
import chaptersData from '../data/chapters-data.json';
import { TranslationEnum, translationsData } from '../../scripts/DataFileParser';

type QuranStoreState = {
	chapters: Quran.Chapter[];
	translations: Record<TranslationEnum, Quran.Translation>;
	firstVersePair: {
		ar: Quran.Verse;
		en: Quran.Verse;
	};
};

function createQuranStore() {
	const { subscribe } = readable<QuranStoreState>({
		chapters: chaptersData,
		translations: translationsData,
		firstVersePair: {
			ar: translationsData[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0],
			en: translationsData[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0]
		}
	});

	let state: QuranStoreState;
	subscribe((v) => (state = v));

	return {
		subscribe,
		getChapter: (chapterNumber: number): Quran.Chapter =>
			state.chapters.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter,
		getVersesAr: (chapterNumber: number): Quran.Verse[] =>
			state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1],
		getVersesEn: (chapterNumber: number): Quran.Verse[] =>
			state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1]
	};
}

export const QuranStore = createQuranStore();
