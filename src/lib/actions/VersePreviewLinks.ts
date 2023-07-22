import { parseKey } from '$lib/utils/VerseKeyUtils.js';
export default (node: HTMLElement, handleVersePreview: (verseKey: QuranRef.Verse) => void) => {
	const handleNoteClick = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target.tagName !== 'A') return;
		const key = parseKey(target.textContent as string) as QuranRef.Verse;
		handleVersePreview(key);
	};

	node.addEventListener('click', handleNoteClick);

	return {
		destroy() {
			node.removeEventListener('click', handleNoteClick);
		}
	};
};
