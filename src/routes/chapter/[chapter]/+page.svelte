<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { QuranStore } from '$lib/store/index.js';
	import { VisibleNotesStore, allNotesVisible } from '$lib/store/VisibleNotesStore.js';

	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VerseGrid from '$lib/components/VerseGrid.svelte';
	import Button from '$lib/components/ToggleButton.svelte';
	import { parseKey } from '$lib/utils/VerseKeyUtils.js';

	const chapterNumber = Number($page.params.chapter);
	const chapter = QuranStore.getChapter(chapterNumber);
	const verses = QuranStore.getVersesByChapter(chapterNumber);
	const firstVerse = QuranStore.getFirstVersePair();

	let highlightVerseNumber: QuranRef.VerseRange | null = null;

	$: if (browser) {
		const qsVerseRange = $page.url.searchParams.get('verse') as string;
		if (qsVerseRange) {
			highlightVerseNumber = parseKey(`${chapterNumber}:${qsVerseRange}`) as QuranRef.VerseRange;
		}
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
				<VerseGrid verses={[firstVerse]} display="none" />
			{/if}

			<VerseGrid {verses} highlightVersePairs={highlightVerseNumber} />
		</div>
	</container>
</div>
