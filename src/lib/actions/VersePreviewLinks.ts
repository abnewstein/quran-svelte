import { parseKey } from '$lib/utils/VerseKeyUtils.js';
export default (node: HTMLElement, handleVersePreview: (verseKey: QuranRef.Verse) => void) => {
	const handleNoteClick = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;
		if (target.tagName !== 'A') return;
		const key = parseKey(target.textContent as string);

		// TODO later allow Notepad and Article References to be clicked
		handleVersePreview(key as QuranRef.Verse);
	};

	node.addEventListener('click', handleNoteClick);

	return {
		destroy() {
			node.removeEventListener('click', handleNoteClick);
		}
	};
};
