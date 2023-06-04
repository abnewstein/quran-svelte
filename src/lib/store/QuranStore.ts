import { writable } from 'svelte/store';
import chaptersData from '../data/chapters-data.json';
import { TranslationEnum, translationsData } from './DataFileParser';

function createQuranStore() {
	const { subscribe } = writable({
		chapters: chaptersData,
		translations: translationsData,
		getChapter: (chapterNumber: number): Quran.Chapter =>
			chaptersData.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter,
		getVersesAr: (chapterNumber: number): Quran.Verse[] =>
			translationsData[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1],
		getVersesEn: (chapterNumber: number): Quran.Verse[] =>
			translationsData[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1],
		firstVersePair: {
			ar: translationsData[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0],
			en: translationsData[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0]
		}
	});

	return {
		subscribe,
	};
}

export const QuranStore = createQuranStore();