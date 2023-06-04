<script lang="ts">
	import VerseGridItem from './VerseGridItem.svelte';
	import { QuranStore } from '$lib/store';

	export let chapterNumber: number;
	$: verseDataEn = $QuranStore.getVersesEn(chapterNumber);
	$: verseDataAr = $QuranStore.getVersesAr(chapterNumber);
	$: firstVerse = $QuranStore.firstVersePair;
</script>

<div class="verse-grid">
	{#if chapterNumber !== 1 && chapterNumber !== 9}
		<VerseGridItem
			verseAr={firstVerse.ar}
			verseEn={firstVerse.en}
			verseNotes={firstVerse.en.notes ?? []}
		/>
	{/if}
	{#each verseDataAr as verse, index (verse.id)}
		{@const verseEn = verseDataEn[index]}
		{@const verseNotes = verseEn?.notes ?? []}
		<VerseGridItem verseAr={verse} {verseEn} {verseNotes} />
	{/each}
</div>

<style lang="scss">
	.verse-grid {
		--uno: grid items-baseline gap-4 rounded p-1;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}
	}
</style>
