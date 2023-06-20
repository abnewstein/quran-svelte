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

	matchesExact(key1: Quran.VerseNoteKey, key2: Quran.VerseNoteKey): boolean {
		const [chapter1, verse1, note1] = VerseNoteKeyUtils.split(key1);
		const [chapter2, verse2, note2] = VerseNoteKeyUtils.split(key2);

		return chapter1 === chapter2 && verse1 === verse2 && note1 === note2;
	},

	matchesAny(key: Quran.VerseNoteKey, keys: Quran.VerseNoteKey[]): boolean {
		return keys.some((key2) => VerseNoteKeyUtils.matches(key, key2));
	},

	addKeyToSet: (key: Quran.VerseNoteKey, set: Set<Quran.VerseNoteKey>): Set<Quran.VerseNoteKey> => {
		set.add(key);
		return set;
	},

	removeKeyFromSet: (
		key: Quran.VerseNoteKey,
		set: Set<Quran.VerseNoteKey>
	): Set<Quran.VerseNoteKey> => {
		set.delete(key);
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
		return set;
	},

	removeMatchingKeysFromSet: (
		key: Quran.VerseNoteKey,
		set: Set<Quran.VerseNoteKey>
	): Set<Quran.VerseNoteKey> => {
		return new Set([...set].filter((storedKey) => !VerseNoteKeyUtils.matches(storedKey, key)));
	},

	getChapterVerseKey(key: Quran.VerseNoteKey): Quran.ChapterVerseKey {
		const [chapter, verse] = VerseNoteKeyUtils.split(key);
		return `${chapter}:${verse}` as Quran.ChapterVerseKey;
	},

	getChapterKey(key: Quran.VerseNoteKey): number {
		const [chapter] = VerseNoteKeyUtils.split(key);
		return chapter;
	},

	isWildcardKey(key: Quran.VerseNoteKey): boolean {
		const parts = VerseNoteKeyUtils.split(key);
		return parts.includes('*');
	},

	isChapterWildcardKey(key: Quran.VerseNoteKey): boolean {
		const [chapter, verse] = VerseNoteKeyUtils.split(key);
		return verse === '*';
	},

	isVerseWildcardKey(key: Quran.VerseNoteKey): boolean {
		const [chapter, verse, note] = VerseNoteKeyUtils.split(key);
		return note === '*';
	}
};
