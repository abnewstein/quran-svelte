<script lang="ts">
	import '@unocss/reset/normalize.css';
	import 'uno.css';
	import './styles.scss';
	import NavHeader from '$lib/components/NavHeader.svelte';
	import { page } from '$app/stores';
</script>

<div class="app">
	<NavHeader />
	{#key $page.url}
		<main>
			<slot />
		</main>
	{/key}
</div>

<style>
</style>
