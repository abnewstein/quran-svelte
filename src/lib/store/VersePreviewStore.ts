import { writable } from 'svelte/store';

type VersePreviewStoreType = Map<number, Array<Quran.ChapterVerseRange>>;

export function createVersePreviewStore(): {
	subscribe: (
		run: (value: VersePreviewStoreType) => void,
		invalidate?: (value?: VersePreviewStoreType) => void
	) => () => void;
	toggleVerseInSet: (noteIndex: number, verseKey: Quran.ChapterVerseRange) => void;
	removeVerseFromSet: (noteIndex: number, verseKey: Quran.ChapterVerseRange) => void;
} {
	const { subscribe, update } = writable<VersePreviewStoreType>(new Map());

	return {
		subscribe,
		toggleVerseInSet: (noteIndex: number, verseKey: Quran.ChapterVerseRange) => {
			update((store) => {
				const verseArray = store.get(noteIndex) ?? [];
				const verseIndex = verseArray.findIndex((v) => v === verseKey);
				if (verseIndex >= 0) {
					verseArray.splice(verseIndex, 1);
				} else {
					verseArray.unshift(verseKey);
				}

				store.set(noteIndex, verseArray);
				return store;
			});
		},
		removeVerseFromSet: (noteIndex: number, verseKey: Quran.ChapterVerseRange) => {
			update((store) => {
				const verseArray = store.get(noteIndex) ?? [];
				const verseIndex = verseArray.findIndex((v) => v === verseKey);

				if (verseIndex >= 0) {
					verseArray.splice(verseIndex, 1);
				}

				store.set(noteIndex, verseArray);
				return store;
			});
		}
	};
}
