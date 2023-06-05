<script lang="ts">
	import { QuranStore } from '$lib/store';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VerseGrid from '$lib/components/VerseGrid.svelte';

	export let data;
	const chapterNumber = Number(data.chapterNumber);
	$: chapter = $QuranStore.getChapter;
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		<ChapterTitle chapter={chapter(chapterNumber)} />
		<hr />
		<VerseGrid {chapterNumber} />
	</container>
</div>
