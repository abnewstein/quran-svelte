export function highlightWordInText(text: string, word: string): string {
	const words = word.split(' ');
	let result = text;

	if (words.length === 1) {
		const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
		result = result.replace(regex, `<mark class="full">$&</mark>`);
	} else {
		words.forEach((w) => {
			const regex = new RegExp(`\\b${escapeRegExp(w)}\\b`, 'gi');
			result = result.replace(regex, `<mark class="partial">$&</mark>`);
		});
	}

	return result;
}

function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
