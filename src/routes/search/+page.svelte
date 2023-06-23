<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { VerseDb, OramaStore } from '$lib/store';
	import VerseGrid from '$lib/components/VerseGrid.svelte';
	import { writable } from 'svelte/store';

	let searchTerm: string = '';

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
		const resultsArEn = [...resultsAr].concat(resultsEn);
		resultsArEn.sort((a, b) => a.ar.id - b.ar.id);
		$results = resultsArEn;
	};

	$: if (browser) {
		searchTerm = $page.url.searchParams.get('q') as string;
		search();
	}
</script>

<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		{#if $results.length}
			<VerseGrid verses={$results} showChapterNumber />
		{:else}
			<div class="text-center">
				<h1 class="text-2xl font-bold">No results found</h1>
				<p class="text-lg">Try searching for something else</p>
			</div>
		{/if}
	</container>
</div>
