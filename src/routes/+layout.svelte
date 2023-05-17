<script lang="ts">
	import Header from './Header.svelte';
	import 'unocss';
	import './styles.css';
</script>

<div class="app">
	<Header />
	<main>
		<slot />
	</main>
</div>

<style>
</style>
