<script lang="ts">
	import '@unocss/reset/normalize.css';
	import 'uno.css';
	import './styles.scss';
	import NavHeader from '$lib/components/NavHeader.svelte';
	import { onMount } from 'svelte';
	import { OramaStore, QuranStore, VerseDb } from '$lib/store';

	onMount(() => {
		console.log('Starting Indexing verses');
		OramaStore.initDB(VerseDb.ArOriginal, QuranStore.getAllVersesAr());
		OramaStore.initDB(VerseDb.EnSamGerrans, QuranStore.getAllVersesEn());
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
