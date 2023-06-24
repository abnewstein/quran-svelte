<script lang="ts">
	import { onMount } from 'svelte';
	import '@unocss/reset/normalize.css';
	import 'uno.css';
	import './styles.scss';
	import NavHeader from '$lib/components/NavHeader.svelte';
	import { OramaStore, QuranStore, VerseDb } from '$lib/store/index.js';

	onMount(async () => {
		console.log('Starting Indexing verses');
		console.time('Indexing verses');
		await OramaStore.load(VerseDb.ArOriginal);
		await OramaStore.load(VerseDb.EnSamGerrans);
		console.timeEnd('Indexing verses');
	});
	export let data;
</script>

<div class="app">
	<NavHeader />
	{#key data.pathname}
		<main>
			<slot />
		</main>
	{/key}
</div>

<style>
</style>
