export function parseChapterVerseKey(key: Quran.ChapterVerseKey): {
	chapterNumber: number | string;
	verseNumber: number | string;
} {
	const [chapterNumber, verseNumber] = key.split(':').map(Number);
	return { chapterNumber, verseNumber };
}

export function parseVerseNoteKey(key: Quran.VerseNoteKey): {
	chapterNumber: number | string;
	verseNumber: number | string;
	noteNumber: number | string;
} {
	const [chapterNumber, verseNumber, noteNumber] = key.split(':').map(Number);
	return { chapterNumber, verseNumber, noteNumber };
}

export function createChapterVerseKey(
	chapterNumber: number | string,
	verseNumber: number | string
): Quran.ChapterVerseKey {
	return `${Number(chapterNumber)}:${Number(verseNumber)}`;
}

export function createVerseNoteKey(
	chapterNumber: number | string,
	verseNumber: number | string,
	noteNumber: number | string
): Quran.VerseNoteKey {
	return `${Number(chapterNumber)}:${Number(verseNumber)}:${Number(noteNumber)}`;
}
export function isValidChapterVerseKey(key: string): key is Quran.ChapterVerseKey {
	const regex = /^\d+:\d+$/;
	return regex.test(key);
}

export function isValidVerseNoteKey(key: string): key is Quran.VerseNoteKey {
	const regex = /^\d+:\d+:\d+$/;
	return regex.test(key);
}

export function parseVerseRange(range: Quran.VerseRange): { start: number; end: number } {
	const [start, end] = range.split('-').map(Number);
	return { start: start, end: end || start };
}

export function createVerseRange(start: number, end?: number): Quran.VerseRange {
	return end && start !== end ? `${start}-${end}` : `${start}`;
}

export function parseChapterVerseRange(range: Quran.ChapterVerseRange): {
	chapterNumber: number;
	verseRange: Quran.VerseRange;
} {
	const [chapterNumber, verseRange] = range.split(':');
	return { chapterNumber: Number(chapterNumber), verseRange } as {
		chapterNumber: number;
		verseRange: Quran.VerseRange;
	};
}

export function createChapterVerseRange(
	chapterNumber: number,
	verseRange: Quran.VerseRange
): Quran.ChapterVerseRange {
	return `${chapterNumber}:${verseRange}`;
}

export function isValidVerseRange(range: string): range is Quran.VerseRange {
	const regex = /^\d+(-\d+)?$/;
	return regex.test(range);
}

export function isValidChapterVerseRange(range: string): range is Quran.ChapterVerseRange {
	const regex = /^\d+:\d+(-\d+)?$/;
	return regex.test(range);
}
