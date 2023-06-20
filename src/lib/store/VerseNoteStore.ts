import { writable } from 'svelte/store';
import { VerseNoteKeyUtils } from '../utils/VerseNoteKeyUtils';

type VerseNoteStoreState = Set<Quran.VerseNoteKey>;

function CreateVerseNoteStore() {
	const { subscribe, set, update } = writable<VerseNoteStoreState>(new Set<Quran.VerseNoteKey>());

	let state: VerseNoteStoreState;
	subscribe((v) => (state = v));

	return {
		subscribe,
		set,
		toggle: (verseNoteKey: Quran.VerseNoteKey) => {
			update((activeVerseNotes) =>
				VerseNoteKeyUtils.toggleKeyInSet(verseNoteKey, activeVerseNotes)
			);
		},
		add: (verseNoteKey: Quran.VerseNoteKey) => {
			update((activeVerseNotes) => VerseNoteKeyUtils.addKeyToSet(verseNoteKey, activeVerseNotes));
		},
		addAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((activeVerseNotes) =>
				VerseNoteKeyUtils.addKeyToSet(
					VerseNoteKeyUtils.join([chapterNumber, verseNumber, '*']),
					activeVerseNotes
				)
			);
		},
		addAllInChapter: (chapterNumber: number) => {
			update((activeVerseNotes) =>
				VerseNoteKeyUtils.addKeyToSet(
					VerseNoteKeyUtils.join([chapterNumber, '*', '*']),
					activeVerseNotes
				)
			);
		},
		remove: (verseNoteKey: Quran.VerseNoteKey) => {
			update((activeVerseNotes) =>
				VerseNoteKeyUtils.removeKeyFromSet(verseNoteKey, activeVerseNotes)
			);
		},
		removeAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((activeVerseNotes) =>
				VerseNoteKeyUtils.removeMatchingKeysFromSet(
					VerseNoteKeyUtils.join([chapterNumber, verseNumber, '*']),
					activeVerseNotes
				)
			);
		},
		removeAllInChapter: (chapterNumber: number) => {
			update((activeVerseNotes) =>
				VerseNoteKeyUtils.removeMatchingKeysFromSet(
					VerseNoteKeyUtils.join([chapterNumber, '*', '*']),
					activeVerseNotes
				)
			);
		},
		matches: (verseNoteKey: Quran.VerseNoteKey) => {
			return VerseNoteKeyUtils.matchesAny(verseNoteKey, [...state]);
		},
		clear: () => {
			set(new Set());
		}
	};
}

export const VerseNoteStore = CreateVerseNoteStore();
