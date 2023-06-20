import { writable } from 'svelte/store';
import { VerseNoteKeyUtils } from '../utils/VerseNoteKeyUtils';

type VerseNoteStoreState = {
	expanded: Set<Quran.VerseNoteKey>;
	collapsed: Set<Quran.VerseNoteKey>;
};

/* 
  We want to take advantage of the Set data structure to store the active verse notes.
  We add another complexity by allowing wildcards in the verse note keys.
  
  User may do the following:
  1. Click on a verse note link -> toggle the verse note.
  2. Click on expand/collapse all in verse -> toggle all verse notes in the verse with wildcard in place of noteNumber.
  3. Click on expand/collapse all in chapter -> toggle all verse notes in the chapter with wildcard in place of verseNumber.
  4. Click on close button in verse note panel -> close only the clicked verse note.
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
				if (VerseNoteKeyUtils.isWildcardKey(verseNoteKey)) {
					if (VerseNoteKeyUtils.removeAllMatchingWildcard(verseNoteKey, state.collapsed) > 0) {
						VerseNoteKeyUtils.toggleKeyInSet(verseNoteKey, state.expanded);
					} else {
						VerseNoteKeyUtils.toggleKeyInSet(verseNoteKey, state.collapsed);
					}
				}
				VerseNoteKeyUtils.toggleKeyInSet(verseNoteKey, state.expanded);
				VerseNoteKeyUtils.removeKeyFromSet(verseNoteKey, state.collapsed);
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
		addAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((state) => {
				const verseWildcardKey = VerseNoteKeyUtils.join([chapterNumber, verseNumber, '*']);
				VerseNoteKeyUtils.addKeyToSet(verseWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(verseWildcardKey, state.collapsed);
				return state;
			});
		},
		addAllInChapter: (chapterNumber: number) => {
			update((state) => {
				const chapterWildcardKey = VerseNoteKeyUtils.join([chapterNumber, '*', '*']);
				VerseNoteKeyUtils.addKeyToSet(chapterWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(chapterWildcardKey, state.collapsed);
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
		removeAllInVerse: (chapterNumber: number, verseNumber: number) => {
			update((state) => {
				const verseWildcardKey = VerseNoteKeyUtils.join([chapterNumber, verseNumber, '*']);
				VerseNoteKeyUtils.removeKeyFromSet(verseWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(verseWildcardKey, state.collapsed);
				return state;
			});
		},
		removeAllInChapter: (chapterNumber: number) => {
			update((state) => {
				const chapterWildcardKey = VerseNoteKeyUtils.join([chapterNumber, '*', '*']);
				VerseNoteKeyUtils.removeAllMatchingWildcard(chapterWildcardKey, state.expanded);
				VerseNoteKeyUtils.removeAllMatchingWildcard(chapterWildcardKey, state.collapsed);
				return state;
			});
		},
		matches: (verseNoteKey: Quran.VerseNoteKey) => {
			const { expanded, collapsed } = activeVerseNotes;
			if (VerseNoteKeyUtils.matchesAny(verseNoteKey, [...collapsed])) {
				return false;
			}
			return VerseNoteKeyUtils.matchesAny(verseNoteKey, [...expanded]);
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
