<script lang="ts">
	import 'uno.css';
	import './styles.css';
	import Header from '$lib/components/Header.svelte';
	import { fade } from 'svelte/transition';

	export let data;
</script>

<div class="app">
	<Header />
	{#key data.pathname}
		<main in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
			<slot />
		</main>
	{/key}
</div>

<style>
</style>
