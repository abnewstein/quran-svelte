import { writable } from 'svelte/store';

type VerseNoteStoreState = Set<number | Quran.ChapterVerseKey | Quran.VerseNoteKey>;

/**
	This store maintains a state for the expansion and collapse of the Quran verse notes.
	It accommodates for different levels of verse note expansion and collapse - individual verse notes, 
	all verse notes in a verse, or all verse notes in a chapter. It also tracks which verse notes 
	have been explicitly collapsed by the user.
*/
function CreateVerseNoteStore() {
	const { subscribe, set, update } = writable<VerseNoteStoreState>(new Set());
	let activeVerseNoteKeys: VerseNoteStoreState;
	subscribe((value) => (activeVerseNoteKeys = value));

	return {
		subscribe,
		toggle: (verseNoteKey: Quran.VerseNoteKey) => {
			update((state) => {
				if (state.has(verseNoteKey)) {
					state.delete(verseNoteKey);
				} else {
					state.add(verseNoteKey);
				}
				state = new Set(state);
				return state;
			});
		},
		toggleAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((state) => {
				const verseNumberKey = `${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey;
				if (state.has(verseNumberKey)) {
					state.delete(verseNumberKey);
				} else {
					state.add(verseNumberKey);
				}
				state = new Set(state);
				return state;
			});
		},
		toggleAllInChapter: (chapterNumber: number) => {
			update((state) => {
				if (chapterNumber !== 1 && chapterNumber !== 9) {
					const chapterVerseKey = '1:1' as Quran.ChapterVerseKey;
					if (state.has(chapterVerseKey)) {
						state.delete(chapterVerseKey);
					} else {
						state.add(chapterVerseKey);
					}
				}
				if (state.has(chapterNumber)) {
					state = new Set();
					return state;
				} else {
					state.add(chapterNumber);
				}
				state = new Set(state);
				return state;
			});
		},
		remove(verseNoteKey: Quran.VerseNoteKey) {
			update((state) => {
				state.delete(verseNoteKey);
				state = new Set(state);
				return state;
			});
		},
		matches: (verseNoteKey: Quran.VerseNoteKey) => {
			const [chapterNumber, verseNumber] = verseNoteKey.split(':');
			// Prepare the keys that would affect the visibility of the note
			const keys = [
				verseNoteKey,
				`${chapterNumber}:${verseNumber}` as Quran.VerseNoteKey,
				chapterNumber
			];

			// Count how many of them are in the set
			let matches = 0;
			for (const key of keys) {
				matches += Array.from(activeVerseNoteKeys).filter((k) => k == key).length;
			}
			activeVerseNoteKeys = new Set(activeVerseNoteKeys);
			// The note is visible if there's an odd number of matches
			return matches % 2 === 1;
		},
		clear: () => {
			set(new Set());
		}
	};
}

export const VerseNoteStore = CreateVerseNoteStore();
