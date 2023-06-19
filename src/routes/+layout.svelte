<script lang="ts">
	import '@unocss/reset/normalize.css';
	import 'uno.css';
	import './styles.scss';
	import NavHeader from '$lib/components/NavHeader.svelte';
	import { fade } from 'svelte/transition';

	export let data;
</script>

<div class="app">
	<NavHeader />
	{#key data.pathname}
		<main in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
			<slot />
		</main>
	{/key}
</div>

<style>
</style>
