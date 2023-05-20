<script lang="ts">
	import { quranDataStore } from '$lib/QuranData';
	import { get } from 'svelte/store';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';

	const quranData = get(quranDataStore);
	const chapters = quranData?.getChapters();
</script>

<div class="p-5 gap-3" grid="~ cols-1 sm:cols-2 md:cols-3 lg:cols-4 xl:cols-6">
	{#if !chapters}
		<div flex="~ col items-center justify-center">
			<span>Loading...</span>
		</div>
	{:else}
		{#each chapters as chapter (chapter.number)}
			<a class="chapter-card" border="solid 1 black rounded-xl" href="/chapter/{chapter.number}">
				<ChapterTitle {chapter} />
				<span class="verse-count text-xs prose-stone" border="solid 1 black rounded-lg" p="y-1 x-2"
					>{chapter.versesCount} verses</span
				>
			</a>
		{/each}
	{/if}
</div>

<style lang="scss">
	a.chapter-card {
		--uno: block relative p-4 pb-6;
		--uno: bg-white shadow-md no-underline text-current;
		&:hover {
			filter: drop-shadow(0 0 3px limegreen);
			box-shadow: 0 0 3px limegreen;
			transition: box-shadow 0.1s ease-in-out;
			text-shadow: 0 0 1px limegreen;
		}
		.verse-count {
			--uno: bottom-1 absolute right-1 left-1 m-a;
			width: fit-content;
		}
	}
</style>
