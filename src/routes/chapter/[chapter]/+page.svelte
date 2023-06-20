<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { QuranStore } from '$lib/store';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VerseGrid from '$lib/components/VerseGrid.svelte';

	const chapterNumber = Number($page.params.chapter);
	let highlightVerseNumber: number | null = null;
	$: if (browser) {
		highlightVerseNumber = $page.url.searchParams.get('verse') as number | null;
	}
	const chapter = QuranStore.getChapter(chapterNumber);
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		<ChapterTitle {chapter} />
		<hr />
		<VerseGrid {chapterNumber} {highlightVerseNumber} />
	</container>
</div>
