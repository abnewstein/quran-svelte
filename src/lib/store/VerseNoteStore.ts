import { writable } from 'svelte/store';
import { VerseNoteKeyUtils } from '../utils/VerseNoteKeyUtils.js';

type VerseNoteStoreState = {
	expanded: Set<Quran.VerseNoteKey>;
	collapsed: Set<Quran.VerseNoteKey>;
};

/**
	This store maintains a state for the expansion and collapse of the Quran verse notes.
	It accommodates for different levels of verse note expansion and collapse - individual verse notes, 
	all verse notes in a verse, or all verse notes in a chapter. It also tracks which verse notes 
	have been explicitly collapsed by the user.
*/
function CreateVerseNoteStore() {
	const { subscribe, set, update } = writable<VerseNoteStoreState>({
		expanded: new Set<Quran.VerseNoteKey>(),
		collapsed: new Set<Quran.VerseNoteKey>()
	});
	let activeVerseNotes: VerseNoteStoreState;
	subscribe((value) => (activeVerseNotes = value));

	return {
		subscribe,
		toggle: (verseNoteKey: Quran.VerseNoteKey) => {
			update((state) => {
				VerseNoteKeyUtils.matchesOnlyWildcard(verseNoteKey, state.expanded)
					? VerseNoteKeyUtils.addKeyToSet(verseNoteKey, state.collapsed)
					: VerseNoteKeyUtils.toggleKeyInSet(verseNoteKey, state.expanded);

				if (VerseNoteKeyUtils.matchesExact(verseNoteKey, state.collapsed)) {
					VerseNoteKeyUtils.removeKeyFromSet(verseNoteKey, state.collapsed);
				}
				return state;
			});
		},
		add: (verseNoteKey: Quran.VerseNoteKey) => {
			update((state) => {
				VerseNoteKeyUtils.addKeyToSet(verseNoteKey, state.expanded);
				VerseNoteKeyUtils.removeKeyFromSet(verseNoteKey, state.collapsed);
				return state;
			});
		},
		remove: (verseNoteKey: Quran.VerseNoteKey) => {
			update((state) => {
				VerseNoteKeyUtils.removeKeyFromSet(verseNoteKey, state.expanded);
				VerseNoteKeyUtils.addKeyToSet(verseNoteKey, state.collapsed);
				return state;
			});
		},
		addAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((state) => {
				const verseWildcardKey = VerseNoteKeyUtils.join([chapterNumber, verseNumber, '*']);
				VerseNoteKeyUtils.addKeyToSet(verseWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(verseWildcardKey, state.collapsed);
				return state;
			});
		},
		addAllInChapter: (chapterNumber: number | null) => {
			update((state) => {
				if (chapterNumber === null) {
					return state;
				}
				const chapterWildcardKey = VerseNoteKeyUtils.join([chapterNumber, '*', '*']);
				VerseNoteKeyUtils.addKeyToSet(chapterWildcardKey, state.expanded);
				VerseNoteKeyUtils.addKeyToSet(VerseNoteKeyUtils.join([1, 1, 1]), state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(chapterWildcardKey, state.collapsed);
				return state;
			});
		},
		removeAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((state) => {
				const verseWildcardKey = VerseNoteKeyUtils.join([chapterNumber, verseNumber, '*']);
				VerseNoteKeyUtils.removeKeyFromSet(verseWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(verseWildcardKey, state.collapsed);
				return state;
			});
		},
		removeAllInChapter: (chapterNumber: number | null) => {
			update((state) => {
				if (chapterNumber === null) {
					return state;
				}
				const chapterWildcardKey = VerseNoteKeyUtils.join([chapterNumber, '*', '*']);
				VerseNoteKeyUtils.removeKeyFromSet(VerseNoteKeyUtils.join([1, 1, 1]), state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(chapterWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(chapterWildcardKey, state.collapsed);
				return state;
			});
		},
		matches: (verseNoteKey: Quran.VerseNoteKey) => {
			const { expanded, collapsed } = activeVerseNotes;
			if (VerseNoteKeyUtils.matchesAny(verseNoteKey, collapsed)) {
				return false;
			}
			return VerseNoteKeyUtils.matchesAny(verseNoteKey, expanded);
		},
		clear: () => {
			set({
				expanded: new Set<Quran.VerseNoteKey>(),
				collapsed: new Set<Quran.VerseNoteKey>()
			});
		}
	};
}

export const VerseNoteStore = CreateVerseNoteStore();
