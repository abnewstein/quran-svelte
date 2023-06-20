export const VerseNoteClicked = (
	node: HTMLElement,
	handleNoteClickFn: (verseNoteKey: Quran.VerseNoteKey) => void
) => {
	const handleNoteClick = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target.tagName.toLowerCase() === 'a') {
			const verseNoteKey = target.id.split('verse-note-link-')[1] ?? '';
			console.log('VerseNoteClicked', verseNoteKey);
			handleNoteClickFn(verseNoteKey as Quran.VerseNoteKey);
		}
	};

	node.addEventListener('click', handleNoteClick);

	return {
		destroy() {
			node.removeEventListener('click', handleNoteClick);
		}
	};
};
