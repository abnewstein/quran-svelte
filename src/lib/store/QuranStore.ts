import { readable } from 'svelte/store';
import chaptersData from '$lib/data/chapters-data.json' assert { type: 'json' };
import { parseVerseRange } from '$lib/utils/VerseKeyUtils.js';
import { TranslationEnum, translationsData } from '../../scripts/DataFileParser.js';

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
		getFirstVersePair: (): Quran.VersePair => ({
			ar: state.translations[TranslationEnum.ARABIC_ORIGINAL]?.verses[0][0],
			en: state.translations[TranslationEnum.ENGLISH_SAM_GERRANS]?.verses[0][0]
		}),
		getChapter: (chapterNumber: number): Quran.Chapter =>
			state.chapters.find((chapter) => chapter.number === chapterNumber) as Quran.Chapter,
		getVerse: (chapterNumber: number, verseNumber: number): Quran.VersePair => {
			return {
				ar: state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1][
					verseNumber - 1
				],
				en: state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1][
					verseNumber - 1
				]
			} as Quran.VersePair;
		},
		getVerses: (chapterNumber: number): Quran.VersePair[] => {
			const versesAr =
				state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[chapterNumber - 1];
			const versesEn =
				state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[chapterNumber - 1];
			return versesAr.map((verse, index) => ({
				ar: verse,
				en: versesEn[index]
			}));
		},
		getVersesByRange: (chapterNumber: number, verseRange: Quran.VerseRange): Quran.VersePair[] => {
			// get verses from chapter and the range of verses only
			const { start, end } = parseVerseRange(verseRange);
			const versesAr = state.translations[TranslationEnum.ARABIC_ORIGINAL].verses[
				chapterNumber - 1
			].slice(start - 1, end);
			const versesEn = state.translations[TranslationEnum.ENGLISH_SAM_GERRANS].verses[
				chapterNumber - 1
			].slice(start - 1, end);
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
