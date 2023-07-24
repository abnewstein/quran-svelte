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

function isValidKey(parts: string[]): boolean {
	if (parts.length < 1 || parts.length > 3) {
		return false;
	}
	const chapterNumber = Number(parts[0]);
	if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
		return false;
	}
	if (parts.length >= 2) {
		const verseParts = parts[1].split('-');
		const verseNumber = Number(verseParts[0]);
		if (isNaN(verseNumber) || verseNumber < 1 || verseNumber > 286) {
			return false;
		}
		if (verseParts.length === 2) {
			const verseEndNumber = Number(verseParts[1]);
			if (isNaN(verseEndNumber) || verseEndNumber < verseNumber || verseEndNumber > 286) {
				return false;
			}
		}
	}
	if (parts.length === 3) {
		const noteNumber = Number(parts[2]);
		if (isNaN(noteNumber) || noteNumber < 1 || noteNumber > 9) {
			return false;
		}
	}
	return true;
}

export function parseKey(key: string): QuranRef.Reference | null {
	const parts = key.includes(':') ? key.split(':') : [key];
	if (!isValidKey(parts)) {
		return null;
	}
	switch (parts.length) {
		case 1:
			return parsers.Chapter(parts);
		case 2:
			return parts[1].includes('-') ? parsers.VerseRange(parts) : parsers.Verse(parts);
		case 3:
			return parsers.Note(parts);
		default:
			return null;
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
