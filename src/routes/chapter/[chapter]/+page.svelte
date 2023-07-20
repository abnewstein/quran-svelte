<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { QuranStore } from '$lib/store/index.js';
	import { VisibleNotesStore, allNotesVisible } from '$lib/store/VisibleNotesStore.js';

	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VerseGrid, { DisplayVerseInfo } from '$lib/components/VerseGrid.svelte';
	import Button from '$lib/components/ToggleButton.svelte';

	const chapterNumber = Number($page.params.chapter);
	const chapter = QuranStore.getChapter(chapterNumber);
	const verses = QuranStore.getVerses(chapterNumber);
	const firstVerse = QuranStore.getFirstVersePair();

	let highlightVerseNumber: Quran.VerseRange | null = null;

	$: if (browser) {
		highlightVerseNumber = $page.url.searchParams.get('verse') as Quran.VerseRange | null;
	}

	function toggleAllNotesInChapter() {
		VisibleNotesStore.toggleAllNotes();
	}
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		<ChapterTitle {chapter} />
		<hr />

		<div class="flex flex-col">
			<Button
				key={chapterNumber}
				class="self-end mr-1 mb-5"
				onClick={toggleAllNotesInChapter}
				active={$allNotesVisible}
			/>
			{#if chapterNumber !== 1 && chapterNumber !== 9}
				<VerseGrid verses={[firstVerse]} />
			{/if}

			<VerseGrid
				{verses}
				highlightVersePairs={highlightVerseNumber}
				displayMode={DisplayVerseInfo.VerseNumber}
			/>
		</div>
	</container>
</div>
