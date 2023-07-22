<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { keyToString } from '$lib/utils/VerseKeyUtils.js';
	import VerseGridItem from './VerseGridItem.svelte';
	import type { displayType } from './VerseNumberInfo.svelte';

	export let verses: Quran.VersePair[];
	export let highlightVersePairs: QuranRef.VerseRange | null = null;
	export let highlightWord: string | null = null;
	export let display: displayType = 'verse';

	let startVerse: number, endVerse: number;

	if (highlightVersePairs?.type === 'range') {
		startVerse = highlightVersePairs.verseStart;
		endVerse = highlightVersePairs.verseEnd;
	} else if (highlightVersePairs?.type === 'verse') {
		startVerse = highlightVersePairs.verseNumber;
		endVerse = highlightVersePairs.verseNumber;
	}

	afterNavigate(() => {
		if (highlightVersePairs) {
			const verseRange = document.getElementById(keyToString(highlightVersePairs));
			if (verseRange) {
				verseRange.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
</script>

<ul class="p-0 m-0">
	{#each verses as verse (`${verse.ar.chapterNumber}:${verse.ar.verseNumber}`)}
		{@const verseNotes = verse?.en?.notes ?? []}
		{@const id = `${verse.ar.chapterNumber}:${verse.ar.verseNumber}`}

		<li
			{id}
			class:highlight={startVerse &&
				endVerse &&
				verse.ar.verseNumber >= startVerse &&
				verse.ar.verseNumber <= endVerse}
		>
			<VerseGridItem {verse} {verseNotes} {highlightWord} {display} />
		</li>
	{/each}
</ul>

<style lang="scss">
	li {
		--uno: grid gap-4 rounded-lg p-1 mb-2;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}
		&.highlight {
			--uno: bg-yellow-200;
		}
	}
</style>
