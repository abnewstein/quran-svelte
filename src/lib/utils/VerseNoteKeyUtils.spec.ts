import { VerseNoteKeyUtils } from './VerseNoteKeyUtils';
import type { VerseNoteParts } from './VerseNoteKeyUtils';
import { describe, expect, test } from 'vitest';

describe('VerseNoteKeyUtils', () => {
	describe('split', () => {
		test('should split key into parts', () => {
			const key = '1:2:3';
			const parts = VerseNoteKeyUtils.split(key);
			expect(parts).toEqual([1, 2, 3]);
		});
	});

	describe('join', () => {
		test('VerseNoteKeyUtils.join', () => {
			const parts = [1, 2, 3] as VerseNoteParts;
			const key = VerseNoteKeyUtils.join(parts);
			expect(key).toEqual('1:2:3');
		});
	});

	describe('matches', () => {
		test('matches works', () => {
			const key1 = '1:2:3';
			const key2 = '1:2:3';
			const result = VerseNoteKeyUtils.matches(key1, key2);
			expect(result).toBe(true);
		});

		test('matches with wildcard', () => {
			const key1 = '1:2:3';
			const key2 = '1:2:*';
			const result1 = VerseNoteKeyUtils.matches(key1, key2);
			expect(result1).toBe(true);

			const key3 = '1:*:*';
			const key4 = '1:2:3';
			const result2 = VerseNoteKeyUtils.matches(key3, key4);
			expect(result2).toBe(true);
		});

		describe('matchesAny', () => {
			test('matchesAny works', () => {
				const key = '1:2:3';
				const keys = ['1:2:3', '1:2:4', '1:3:3'] as Quran.VerseNoteKey[];
				const result = VerseNoteKeyUtils.matchesAny(key, new Set(keys));
				expect(result).toBe(true);
			});

			test('matchesAny with wildcard', () => {
				const key = '1:2:3';
				const keys = ['1:*:*'] as Quran.VerseNoteKey[];
				const result = VerseNoteKeyUtils.matchesAny(key, new Set(keys));
				expect(result).toBe(true);

				const key2 = '1:2:3';
				const keys2 = ['1:2:*', '1:3:3'] as Quran.VerseNoteKey[];
				const result2 = VerseNoteKeyUtils.matchesAny(key2, new Set(keys2));
				expect(result2).toBe(true);

				const key3 = '1:2:3';
				const keys3 = ['1:2:*', '1:3:*'] as Quran.VerseNoteKey[];
				const result3 = VerseNoteKeyUtils.matchesAny(key3, new Set(keys3));
				expect(result3).toBe(true);

				const key4 = '1:2:3';
				const keys4 = ['1:2:4', '1:3:3'] as Quran.VerseNoteKey[];
				const result4 = VerseNoteKeyUtils.matchesAny(key4, new Set(keys4));
				expect(result4).toBe(false);

				const key5 = '1:2:3';
				const keys5 = ['1:2:4', '1:3:3', '1:2:3'] as Quran.VerseNoteKey[];
				const result5 = VerseNoteKeyUtils.matchesAny(key5, new Set(keys5));
				expect(result5).toBe(true);
			});
		});

		describe('matchesExact', () => {
			test('should return true when key exactly matches one in set', () => {
				const key = '1:2:3';
				const keys = new Set(['1:2:3', '1:2:4', '1:3:3'] as Quran.VerseNoteKey[]);
				const result = VerseNoteKeyUtils.matchesExact(key, keys);
				expect(result).toBe(true);
			});

			test('should return false when key does not exactly match any in set', () => {
				const key = '1:2:5';
				const keys = new Set(['1:2:3', '1:2:4', '1:3:3'] as Quran.VerseNoteKey[]);
				const result = VerseNoteKeyUtils.matchesExact(key, keys);
				expect(result).toBe(false);
			});

			test('should not consider wildcards as exact matches', () => {
				const key = '1:2:3';
				const keys = new Set(['1:2:*', '1:3:3'] as Quran.VerseNoteKey[]);
				const result = VerseNoteKeyUtils.matchesExact(key, keys);
				expect(result).toBe(false);
			});
		});
	});

	describe('Set operations', () => {
		test('VerseNoteKeyUtils.addKeyToSet', () => {
			const key = '1:2:3';
			const set = new Set(['1:2:4'] as Quran.VerseNoteKey[]);
			const result = VerseNoteKeyUtils.addKeyToSet(key, set);
			expect(result).toEqual(new Set(['1:2:4', '1:2:3']));
		});

		test('VerseNoteKeyUtils.removeKeyFromSet', () => {
			const key = '1:2:3';
			const set = new Set(['1:2:3', '1:2:4'] as Quran.VerseNoteKey[]);
			const result = VerseNoteKeyUtils.removeKeyFromSet(key, set);
			expect(result).toEqual(new Set(['1:2:4']));
		});

		test('VerseNoteKeyUtils.toggleKeyInSet', () => {
			const key = '1:2:3';
			const set = new Set(['1:2:4'] as Quran.VerseNoteKey[]);
			const result1 = VerseNoteKeyUtils.toggleKeyInSet(key, set);
			expect(result1).toEqual(new Set(['1:2:4', '1:2:3']));
			const result2 = VerseNoteKeyUtils.toggleKeyInSet(key, result1);
			expect(result2).toEqual(new Set(['1:2:4']));
		});
	});

	describe('Wildcard operations', () => {
		test('VerseNoteKeyUtils.removeAllMatchingWildcard', () => {
			const wildcardKey = '1:2:*';
			const set = new Set(['1:2:3', '1:2:4', '1:3:3'] as Quran.VerseNoteKey[]);
			const result = VerseNoteKeyUtils.removeAllMatchingWildcard(wildcardKey, set);
			expect(result).toEqual(2);
		});

		test('VerseNoteKeyUtils.removeAllMatchingWildcard with no match', () => {
			const wildcardKey = '1:2:*';
			const set = new Set(['1:3:3'] as Quran.VerseNoteKey[]);
			const result = VerseNoteKeyUtils.removeAllMatchingWildcard(wildcardKey, set);
			expect(result).toEqual(0);
		});

		test('VerseNoteKeyUtils.removeAllMatchingWildcard with no wildcard', () => {
			const wildcardKey = '1:2:3';
			const set = new Set(['1:3:3', '1:2:3'] as Quran.VerseNoteKey[]);
			const result = VerseNoteKeyUtils.removeAllMatchingWildcard(wildcardKey, set);
			expect(result).toEqual(1);
		});

		test('VerseNoteKeyUtils.isWildcardKey', () => {
			const key = '1:2:*';
			const result = VerseNoteKeyUtils.isWildcardKey(key);
			expect(result).toBe(true);
		});

		test('VerseNoteKeyUtils.isWildcardKey with no wildcard', () => {
			const key = '1:2:3';
			const result = VerseNoteKeyUtils.isWildcardKey(key);
			expect(result).toBe(false);
		});

		test('VerseNoteKeyUtils.isMoreSpecificKey', () => {
			const key1 = '1:2:3';
			const key2 = '1:2:*';
			const result = VerseNoteKeyUtils.isMoreSpecificKey(key1, key2);
			expect(result).toBe(true);

			const key3 = '1:2:3';
			const key4 = '1:2:4';
			const result2 = VerseNoteKeyUtils.isMoreSpecificKey(key3, key4);
			expect(result2).toBe(false);

			const key5 = '1:2:3';
			const key6 = '1:3:3';
			const result3 = VerseNoteKeyUtils.isMoreSpecificKey(key5, key6);
			expect(result3).toBe(false);

			const key7 = '1:2:*';
			const key8 = '2:*:*';
			const result4 = VerseNoteKeyUtils.isMoreSpecificKey(key7, key8);
			expect(result4).toBe(true);
		});
	});
});
