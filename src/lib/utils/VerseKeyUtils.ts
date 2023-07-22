const parsers = {
	Chapter: (parts: string[]): QuranRef.Chapter => ({
		type: 'chapter',
		chapterNumber: Number(parts[0])
	}),
	Verse: (parts: string[]): QuranRef.Verse => ({
		type: 'verse',
		chapterNumber: Number(parts[0]),
		verseNumber: Number(parts[1])
	}),
	VerseRange: (parts: string[]): QuranRef.Range => {
		const verseParts = parts[1].split('-');
		return {
			type: 'range',
			chapterNumber: Number(parts[0]),
			verseStart: Number(verseParts[0]),
			verseEnd: Number(verseParts[1])
		};
	},
	Note: (parts: string[]): QuranRef.Note => ({
		type: 'note',
		chapterNumber: Number(parts[0]),
		verseNumber: Number(parts[1]),
		noteNumber: Number(parts[2])
	})
};

export function parseKey(key: string): QuranRef.Reference {
	const parts = key.includes(':') ? key.split(':') : [key];
	switch (parts.length) {
		case 1:
			return parsers.Chapter(parts);
		case 2:
			return parts[1].includes('-') ? parsers.VerseRange(parts) : parsers.Verse(parts);
		case 3:
			return parsers.Note(parts);
		default:
			throw new Error(`Invalid key: ${key}`);
	}
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
