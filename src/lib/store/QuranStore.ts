import { writable, derived } from 'svelte/store';
import chaptersData from '../data/chapters-data.json';
import { TranslationEnum, translationsData } from './DataFileParser';

const _quranDataStore = writable({
	chapters: chaptersData,
	translations: translationsData
});

export const quranDataStore = {
	subscribe: _quranDataStore.subscribe,

	chapters: derived(_quranDataStore, ($store) => $store.chapters),

	getChapter: derived(
		_quranDataStore,
		($store) =>
			(chapterNumber: number): Quran.Chapter =>
				$store.chapters.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter
	),

	getVersesAr: derived(
		_quranDataStore,
		($store) =>
			(chapterNumber: number): Quran.Verse[] =>
				$store.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1]
	),

	getVersesEn: derived(
		_quranDataStore,
		($store) =>
			(chapterNumber: number): Quran.Verse[] =>
				$store.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1]
	),

	firstVersePair: derived(_quranDataStore, ($store) => {
		const firstVerseAr = $store.translations[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0];
		const firstVerseEn = $store.translations[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0];

		return {
			ar: firstVerseAr,
			en: firstVerseEn
		};
	})
};
