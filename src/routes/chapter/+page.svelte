<script lang="ts">
	import { QuranStore } from '$lib/store/QuranStore.js';
	import ChapterCard from '$lib/components/ChapterCard.svelte';

	const { chapters } = $QuranStore;
</script>

<div class="outer">
	{#if !chapters}
		<div class="flex flex-col items-center justify-center">
			<span>Loading...</span>
		</div>
	{:else}
		{#each chapters as chapter (chapter.number)}
			<ChapterCard {chapter} />
		{/each}
	{/if}
</div>

<style lang="scss">
	.outer {
		--uno: grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6;
		--uno: p-5 gap-3 lg:gap-y-6 lg:gap-x-10;
	}
</style>
