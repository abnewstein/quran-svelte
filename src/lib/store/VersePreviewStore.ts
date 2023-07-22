import { writable } from 'svelte/store';
import { keyToString } from '$lib/utils/VerseKeyUtils.js';

type VersePreviewStoreType = Record<string, Array<QuranRef.VerseRange>>;

export function createVersePreviewStore(): {
	subscribe: (
		run: (value: VersePreviewStoreType) => void,
		invalidate?: (value?: VersePreviewStoreType) => void
	) => () => void;
	toggleVerseInSet: (verseRef: QuranRef.Note, targetVerseRef: QuranRef.VerseRange) => void;
	removeVerseFromSet: (verseRef: QuranRef.Note, targetVerseRef: QuranRef.VerseRange) => void;
} {
	const { subscribe, update } = writable<VersePreviewStoreType>({});

	return {
		subscribe,
		toggleVerseInSet: (noteRef: QuranRef.Note, targetVerseRef: QuranRef.VerseRange) => {
			update((store) => {
				const verseRefKey = keyToString(noteRef);
				const verseRefArray = store[verseRefKey] ?? [];
				const verseIndex = verseRefArray.findIndex(
					(v) => keyToString(v) === keyToString(targetVerseRef)
				);
				if (verseIndex >= 0) {
					verseRefArray.splice(verseIndex, 1);
				} else {
					verseRefArray.unshift(targetVerseRef);
				}

				store[verseRefKey] = verseRefArray;
				return store;
			});
		},
		removeVerseFromSet: (noteRef: QuranRef.Note, targetVerseRef: QuranRef.VerseRange) => {
			update((store) => {
				const verseRefKey = keyToString(noteRef);
				const verseArray = store[verseRefKey] ?? [];
				const verseIndex = verseArray.findIndex(
					(v) => keyToString(v) === keyToString(targetVerseRef)
				);

				if (verseIndex >= 0) {
					verseArray.splice(verseIndex, 1);
				}

				store[verseRefKey] = verseArray;
				return store;
			});
		}
	};
}
