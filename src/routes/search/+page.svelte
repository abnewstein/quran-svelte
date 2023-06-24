<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { VerseDb, OramaStore } from '$lib/store/index.js';
	import VerseGrid, { DisplayVerseInfo } from '$lib/components/VerseGrid.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let searchTerm: string = '';
	let isSearchIndexReady = false;

	const results = writable<Quran.VersePair[]>([]);

	// wait until oramastore is ready and then give the search result
	const search = async () => {
		if (!searchTerm.trim()) {
			console.warn('Cannot search with an empty query');
			return;
		}
		if (!OramaStore.isReady()) {
			console.log('OramaStore is not ready yet, waiting for it to be ready');
			setTimeout(search, 1000);
			return;
		}
		console.log(`Searching for "${searchTerm}"`);

		const resultsAr = await OramaStore.search(VerseDb.ArOriginal, searchTerm);
		const resultsEn = await OramaStore.search(VerseDb.EnSamGerrans, searchTerm);
		console.log(
			`Found ${resultsAr.length} results in Arabic and ${resultsEn.length} results in English`
		);
		const resultsArEn = [...resultsAr].concat(resultsEn);
		$results = resultsArEn;
	};

	$: if (browser) {
		searchTerm = $page.url.searchParams.get('q') as string;
		search();
	}

	onMount(async () => {
		console.log('Starting Indexing verses');
		console.time('Indexing verses');
		await OramaStore.load(VerseDb.ArOriginal);
		await OramaStore.load(VerseDb.EnSamGerrans);
		isSearchIndexReady = true;
		console.timeEnd('Indexing verses');
	});
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		{#if !isSearchIndexReady}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Loading...</h1>
				<p class="text-lg">Please wait while we load the verses</p>
			</div>
		{:else}
			<div class="text-center">
				<h1 class="text-2xl font-bold">Search results for "{searchTerm}"</h1>
				<p class="text-lg">Found {$results.length} verses</p>
			</div>
			{#if $results.length}
				<VerseGrid verses={$results} displayMode={DisplayVerseInfo.ChapterAndVerseNumber} />
			{:else}
				<div class="text-center">
					<h1 class="text-2xl font-bold">No verses found</h1>
					<p class="text-lg">Try searching for something else</p>
				</div>
			{/if}
		{/if}
	</container>
</div>
