import { writable } from 'svelte/store';

export type VerseNoteStoreKey = number | Quran.ChapterVerseKey | Quran.VerseNoteKey;
export type VerseNoteStoreState = Set<VerseNoteStoreKey>;

function createVerseNoteStore() {
	const { subscribe, set, update } = writable<VerseNoteStoreState>(new Set());
	let activeVerseNoteKeys: VerseNoteStoreState;
	subscribe((value) => (activeVerseNoteKeys = value));

	const toggleItemInSet = (item: Quran.VerseNoteKey | Quran.ChapterVerseKey | number) =>
		update(
			(state) => new Set(state.has(item) ? [...state].filter((i) => i !== item) : [...state, item])
		);

	const removeItemFromSet = (item: Quran.VerseNoteKey) =>
		update((state) => new Set([...state].filter((i) => i !== item)));

	return {
		subscribe,
		toggle: toggleItemInSet,
		toggleAllInVerse: (chapterNumber: number, verseNumber: number) =>
			toggleItemInSet(`${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey),
		toggleAllInChapter: (chapterNumber: number) => {
			if (![1, 9].includes(chapterNumber)) {
				toggleItemInSet('1:1' as Quran.ChapterVerseKey);
			}
			toggleItemInSet(chapterNumber);
		},
		remove: removeItemFromSet,
		matches: (verseNoteKey: Quran.VerseNoteKey) => {
			const [chapterNumber, verseNumber] = verseNoteKey.split(':');
			const keys = [
				verseNoteKey as Quran.VerseNoteKey,
				`${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey,
				Number(chapterNumber)
			];
			return keys.filter((key) => activeVerseNoteKeys.has(key)).length % 2 === 1;
		},
		clear: () => {
			set(new Set());
		}
	};
}

export const VerseNoteStore = createVerseNoteStore();
