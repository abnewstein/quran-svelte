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

	matchesExact(key: Quran.VerseNoteKey, keys: Set<Quran.VerseNoteKey>): boolean {
		return keys.has(key);
	},

	matchesAny(key: Quran.VerseNoteKey, keys: Set<Quran.VerseNoteKey>): boolean {
		return [...keys].some((key2) => VerseNoteKeyUtils.matches(key, key2));
	},

	matchesOnlyWildcard(key: Quran.VerseNoteKey, set: Set<Quran.VerseNoteKey>): boolean {
		const [chapter1, verse1, note1] = VerseNoteKeyUtils.split(key);
		for (const key2 of set) {
			const [chapter2, verse2, note2] = VerseNoteKeyUtils.split(key2);
			if (
				chapter1 === chapter2 &&
				(verse1 === verse2 || verse1 === '*' || verse2 === '*') &&
				(note1 === '*' || note2 === '*')
			) {
				return true;
			}
		}
		return false;
	},

	addKeyToSet: (key: Quran.VerseNoteKey, set: Set<Quran.VerseNoteKey>): void => {
		set.add(key);
	},

	removeKeyFromSet: (key: Quran.VerseNoteKey, set: Set<Quran.VerseNoteKey>): void => {
		set.delete(key);
	},

	toggleKeyInSet: (key: Quran.VerseNoteKey, set: Set<Quran.VerseNoteKey>): void => {
		set.has(key) ? set.delete(key) : set.add(key);
	},

	removeAllMatchingWildcard: (
		wildcardKey: Quran.VerseNoteKey,
		set: Set<Quran.VerseNoteKey>
	): void => {
		for (const key of set) {
			if (VerseNoteKeyUtils.matches(wildcardKey, key)) {
				set.delete(key);
			}
		}
	},

	isWildcardKey(key: Quran.VerseNoteKey): boolean {
		return key.includes('*');
	},

	isMoreSpecificKey(key1: Quran.VerseNoteKey, key2: Quran.VerseNoteKey): boolean {
		// Count the number of wildcards in each key
		const score1 = (key1.match(/\*/g) || []).length;
		const score2 = (key2.match(/\*/g) || []).length;

		// The key with fewer wildcards is more specific
		return score1 < score2;
	}
};
