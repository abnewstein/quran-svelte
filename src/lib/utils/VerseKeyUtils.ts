const toNumber = (str: string): number => Number(str);
const isValidNumber = (num: number, max: number): boolean => !isNaN(num) && num >= 1 && num <= max;
const isValidVerseNumber = (num: number): boolean => isValidNumber(num, 286);
const isValidChapterNumber = (num: number): boolean => isValidNumber(num, 114);
const isValidNoteNumber = (num: number): boolean => isValidNumber(num, 50);

const parseVersePart = (versePart: string): { verseStart: number; verseEnd?: number } => {
	const [start, end] = versePart.split('-').map(toNumber);
	const verseStart = isValidVerseNumber(start) ? start : NaN;
	const verseEnd = isValidVerseNumber(end) ? end : undefined;
	return { verseStart, verseEnd };
};

const parsers: Record<number, (parts: string[]) => QuranRef.Reference | null> = {
	1: ([chapter]) =>
		isValidChapterNumber(toNumber(chapter))
			? { type: 'chapter', chapterNumber: toNumber(chapter) }
			: null,
	2: ([chapter, versePart]) => {
		const { verseStart, verseEnd } = parseVersePart(versePart);
		return verseEnd
			? { type: 'range', chapterNumber: toNumber(chapter), verseStart, verseEnd }
			: { type: 'verse', chapterNumber: toNumber(chapter), verseNumber: verseStart };
	},
	3: ([chapter, verse, note]) =>
		isValidNoteNumber(toNumber(note))
			? {
					type: 'note',
					chapterNumber: toNumber(chapter),
					verseNumber: toNumber(verse),
					noteNumber: toNumber(note)
			  }
			: null
};

export function parseKey(key: string): QuranRef.Reference | null {
	const parts = key.split(':');
	const parser = parsers[parts.length];
	return parser ? parser(parts) : null;
}

export function keyToString(ref: QuranRef.Reference): string {
	switch (ref.type) {
		case 'chapter':
			return `${ref.chapterNumber}`;
		case 'verse':
			return `${ref.chapterNumber}:${ref.verseNumber}`;
		case 'range':
			return `${ref.chapterNumber}:${ref.verseStart}-${ref.verseEnd}`;
		case 'note':
			return `${ref.chapterNumber}:${ref.verseNumber}:${ref.noteNumber}`;
	}
}
