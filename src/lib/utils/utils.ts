export function highlightWordInText(text: string, word: string): string {
	// 1. matches the full word as mark tag with class full
	let regex = new RegExp(`\\b${word}\\b`, 'gi'); // Use word boundaries to find whole words
	let highlightedText = text.replace(regex, `<mark class="full">$&</mark>`);

	// 2. split word by space if it has multiple words
	const words = word.split(' ');

	// 3. matches the word as mark tag with class part
	words.forEach((w) => {
		// To avoid nested tags, check if the word is already marked as full.
		regex = new RegExp(`(?<!<mark class="full">)${w}(?!</mark>)`, 'gi');
		highlightedText = highlightedText.replace(regex, `<mark class="partial">$&</mark>`);
	});

	return highlightedText;
}
