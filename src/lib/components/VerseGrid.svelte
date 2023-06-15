<script lang="ts">
	import VerseGridItem from './VerseGridItem.svelte';
	import { QuranStore } from '$lib/store';
	import { onMount } from 'svelte';

	export let chapterNumber: number;
	export let highlightVerseNumber: number | null = null;
	$: verseDataEn = $QuranStore.getVersesEn(chapterNumber);
	$: verseDataAr = $QuranStore.getVersesAr(chapterNumber);
	$: firstVerse = $QuranStore.firstVersePair;

	onMount(() => {
		if (highlightVerseNumber) {
			const verse = document.getElementById(`verse-${chapterNumber}:${highlightVerseNumber}`);
			if (verse) {
				verse.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
</script>

<ul>
	{#if chapterNumber !== 1 && chapterNumber !== 9}
		<li>
			<VerseGridItem
				verseAr={firstVerse.ar}
				verseEn={firstVerse.en}
				verseNotes={firstVerse.en.notes ?? []}
				hideVerseNumber
			/>
		</li>
	{/if}
	{#each verseDataAr as verse, index (verse.id)}
		{@const verseEn = verseDataEn[index]}
		{@const verseNotes = verseEn?.notes ?? []}
		<li
			id="verse-{verse.chapterNumber}:{verse.verseNumber}"
			class:highlight={verse.verseNumber == highlightVerseNumber}
		>
			<VerseGridItem verseAr={verse} {verseEn} {verseNotes} />
		</li>
	{/each}
</ul>

<style lang="scss">
	li {
		--uno: grid items-baseline gap-4 rounded-lg p-1;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}

		&.highlight {
			--uno: bg-yellow-200;
		}
	}
</style>
