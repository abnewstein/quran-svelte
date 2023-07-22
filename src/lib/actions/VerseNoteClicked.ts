import { parseKey } from '$lib/utils/VerseKeyUtils.js';
export default (node: HTMLElement, handleNoteClickFn: (verseNoteKey: QuranRef.Note) => void) => {
	const handleNoteClick = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target.tagName.toLowerCase() === 'button') {
			const str = target.id.split('verse-note-link-')[1] as string;
			if (str) {
				const verseNoteKey = parseKey(str) as QuranRef.Note;
				handleNoteClickFn(verseNoteKey);
			}
		}
	};

	node.addEventListener('click', handleNoteClick);

	return {
		destroy() {
			node.removeEventListener('click', handleNoteClick);
		}
	};
};
