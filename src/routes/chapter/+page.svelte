<script lang="ts">
	import { quranDataStore } from '$lib/QuranStore';
	import ChapterCard from '$lib/components/ChapterCard.svelte';

	const { chapters } = $quranDataStore;
</script>

<div class="p-5 gap-3" grid="~ cols-1 sm:cols-2 md:cols-3 lg:cols-4 xl:cols-6">
	{#if !chapters}
		<div flex="~ col items-center justify-center">
			<span>Loading...</span>
		</div>
	{:else}
		{#each chapters as chapter (chapter.number)}
			<ChapterCard {chapter} />
		{/each}
	{/if}
</div>
