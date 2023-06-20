/* eslint-disable @typescript-eslint/no-unused-vars */
export type ChapterVerseParts = [number, number];
export type VerseNoteParts = [number, number | '*', number | '*'];

export const VerseNoteKeyUtils = {
	split(key: Quran.VerseNoteKey): VerseNoteParts {
		return key
			.split(':')
			.map((part) => (isNaN(Number(part)) ? part : Number(part))) as VerseNoteParts;
	},

	join(parts: VerseNoteParts): Quran.VerseNoteKey {
		return `${parts[0]}:${parts[1]}:${parts[2]}` as Quran.VerseNoteKey;
	},

	matches(key1: Quran.VerseNoteKey, key2: Quran.VerseNoteKey): boolean {
		const [chapter1, verse1, note1] = VerseNoteKeyUtils.split(key1);
		const [chapter2, verse2, note2] = VerseNoteKeyUtils.split(key2);

		return (
			chapter1 === chapter2 &&
			(verse1 === verse2 || verse1 === '*' || verse2 === '*') &&
			(note1 === note2 || note1 === '*' || note2 === '*')
		);
	},

	matchesAny(key: Quran.VerseNoteKey, keys: Quran.VerseNoteKey[]): boolean {
		return keys.some((key2) => VerseNoteKeyUtils.matches(key, key2));
	},

	addKeyToSet: (key: Quran.VerseNoteKey, set: Set<Quran.VerseNoteKey>): Set<Quran.VerseNoteKey> => {
		set.add(key);
		set = new Set(set);
		return set;
	},

	removeKeyFromSet: (
		key: Quran.VerseNoteKey,
		set: Set<Quran.VerseNoteKey>
	): Set<Quran.VerseNoteKey> => {
		set.delete(key);
		set = new Set(set);
		return set;
	},

	toggleKeyInSet: (
		key: Quran.VerseNoteKey,
		set: Set<Quran.VerseNoteKey>
	): Set<Quran.VerseNoteKey> => {
		if (set.has(key)) {
			set.delete(key);
		} else {
			set.add(key);
		}
		set = new Set(set);
		return set;
	},

	removeAllMatchingWildcard: (
		wildcardKey: Quran.VerseNoteKey,
		set: Set<Quran.VerseNoteKey>
	): number => {
		let count = 0;
		for (const key of set) {
			if (VerseNoteKeyUtils.matches(wildcardKey, key)) {
				set.delete(key);
				count++;
			}
		}
		return count;
	},

	isWildcardKey(key: Quran.VerseNoteKey): boolean {
		return key.includes('*');
	},

	/** Returns true if key1 is more specific than key2
	 * i.e key1 = 1:1:* and key2 = 1:1:1
	 * then key2 is more specific than key1
	 */

	isMoreSpecificKey(key1: Quran.VerseNoteKey, key2: Quran.VerseNoteKey): boolean {
		const [chapter1, verse1, note1] = VerseNoteKeyUtils.split(key1);
		const [chapter2, verse2, note2] = VerseNoteKeyUtils.split(key2);

		if (key1.includes('*')) {
			return false;
		}

		if (key2.includes('*')) {
			return true;
		}
		return false;
	}
};
