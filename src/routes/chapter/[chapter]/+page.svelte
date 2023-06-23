<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { QuranStore, VerseNoteStore } from '$lib/store';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VerseGrid from '$lib/components/VerseGrid.svelte';

	const chapterNumber = Number($page.params.chapter);
	const chapter = QuranStore.getChapter(chapterNumber);
	const verses = QuranStore.getVerses(chapterNumber);
	const firstVerse = QuranStore.firstVersePair;

	let highlightVerseNumber: number | null = null;

	$: if (browser) {
		highlightVerseNumber = $page.url.searchParams.get('verse') as number | null;
	}
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		<ChapterTitle {chapter} />
		<hr />

		<button on:click={() => VerseNoteStore.addAllInChapter(chapterNumber)}>Expand</button>
		<button on:click={() => VerseNoteStore.removeAllInChapter(chapterNumber)}>Collapse</button>
		{#if chapterNumber !== 1 && chapterNumber !== 9}
			<VerseGrid {chapterNumber} verses={[firstVerse]} hideVerseNumber />
		{/if}

		<VerseGrid {chapterNumber} {verses} {highlightVerseNumber} />
	</container>
</div>
