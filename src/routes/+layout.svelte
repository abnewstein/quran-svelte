<script lang="ts">
	import '@unocss/reset/normalize.css';
	import 'uno.css';
	import './styles.scss';
	import NavHeader from '$lib/components/NavHeader.svelte';

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
