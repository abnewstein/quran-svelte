export const VersePreviewlinks = (
	node: HTMLElement,
	handleVersePreview: (verseKey: Quran.ChapterVerseRange) => void
) => {
	const handleNoteClick = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target.tagName !== 'A') return;
		handleVersePreview(target.textContent as Quran.ChapterVerseRange);
	};

	node.addEventListener('click', handleNoteClick);

	return {
		destroy() {
			node.removeEventListener('click', handleNoteClick);
		}
	};
};
