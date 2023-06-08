<script lang="ts">
	import VerseGridItem from './VerseGridItem.svelte';
	import { QuranStore } from '$lib/store';

	export let chapterNumber: number;
	$: verseDataEn = $QuranStore.getVersesEn(chapterNumber);
	$: verseDataAr = $QuranStore.getVersesAr(chapterNumber);
	$: firstVerse = $QuranStore.firstVersePair;
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
		<li>
			<VerseGridItem verseAr={verse} {verseEn} {verseNotes} />
		</li>
	{/each}
</ul>

<style lang="scss">
	li {
		--uno: grid items-baseline gap-4 rounded p-1;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}
	}
</style>
