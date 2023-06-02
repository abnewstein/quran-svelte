<script lang="ts">
	import { quranDataStore } from '$lib/store';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import VersesGrid from '$lib/components/VersesGrid.svelte';

	export let data;
	const chapterNumber = Number(data.chapterNumber);
	$: chapter = quranDataStore.getChapter;
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		{#if chapter}
			<ChapterTitle chapter={$chapter(chapterNumber)} />
		{/if}
		<hr />
		<VersesGrid {chapterNumber} />
	</container>
</div>
