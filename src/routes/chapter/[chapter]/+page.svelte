<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { QuranStore, VerseNoteStore } from '$lib/store/index.js';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VerseGrid, { DisplayVerseInfo } from '$lib/components/VerseGrid.svelte';
	import Button from '$lib/components/ToggleButton.svelte';

	const chapterNumber = Number($page.params.chapter);
	const chapter = QuranStore.getChapter(chapterNumber);
	const verses = QuranStore.getVerses(chapterNumber);
	const firstVerse = QuranStore.getFirstVersePair();

	let highlightVerseNumber: number | null = null;

	$: if (browser) {
		highlightVerseNumber = $page.url.searchParams.get('verse') as number | null;
	}
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		<ChapterTitle {chapter} />
		<hr />

		<div class="flex flex-col">
			<Button
				class="self-end mr-1"
				onClick={() => VerseNoteStore.toggleAllInChapter(chapterNumber)}
			/>
			{#key $VerseNoteStore}
				{#if chapterNumber !== 1 && chapterNumber !== 9}
					<VerseGrid {chapterNumber} verses={[firstVerse]} />
				{/if}

				<VerseGrid
					{chapterNumber}
					{verses}
					{highlightVerseNumber}
					displayMode={DisplayVerseInfo.VerseNumber}
				/>
			{/key}
		</div>
	</container>
</div>
