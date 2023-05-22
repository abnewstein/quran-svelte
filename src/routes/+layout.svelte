<script lang="ts">
	import 'uno.css';
	import './styles.css';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="app">
	<Header />
	<main>
		<slot />
	</main>
</div>

<style>
</style>
