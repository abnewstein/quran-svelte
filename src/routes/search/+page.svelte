<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { OramaStore } from '$lib/store/index.js';
	import VerseGrid from '$lib/components/VerseGrid.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let searchTerm: string = '';
	let isSearchIndexReady = false;

	const results = writable<Quran.SearchResult>();

	const search = async () => {
		console.log(`Searching for "${searchTerm}"`);

		if (!searchTerm) return;
		if (!(await OramaStore.isReady())) {
			console.log('OramaStore is not ready yet');
			return;
		}
		$results = await OramaStore.search(searchTerm);
	};

	$: if (browser) {
		searchTerm = $page.url.searchParams.get('q') as string;
		if (searchTerm.trim() && isSearchIndexReady) search();
	}

	onMount(async () => {
		await OramaStore.init();
		isSearchIndexReady = true;
	});
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		{#if !isSearchIndexReady}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Loading...</h1>
				<p class="text-lg">
					Please wait while we index the verses, this may take a minute on first page load.
					Subsequent searches will be much faster.
				</p>
			</div>
		{:else if $results}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Search results for "{searchTerm}"</h1>
				<p class="text-lg">Found {$results.verseCount} verses</p>
			</div>
			{#if $results.verseCount > 0}
				{#key searchTerm}
					<VerseGrid verses={$results.verses} highlightWord={searchTerm} display="chapter:verse" />
				{/key}
			{:else}
				<div class="text-center">
					<h1 class="text-2xl font-bold">No verses found</h1>
					<p class="text-lg">Try searching for something else</p>
				</div>
			{/if}
		{/if}
	</container>
</div>
