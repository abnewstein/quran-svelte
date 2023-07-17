export const VersePreviewlinks = (node: HTMLElement) => {
	const handleNoteClick = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target.tagName !== 'A') return;
		const verseKey = target.textContent;
		console.log(verseKey);
	};

	node.addEventListener('click', handleNoteClick);

	return {
		destroy() {
			node.removeEventListener('click', handleNoteClick);
		}
	};
};
