<script lang="ts">
	export let path: string;
	export let name: string;
	export let icon: string;
	export let isLink: boolean;

	import { page } from '$app/stores';
</script>

{#if isLink}
	<a href={path} class:active={$page.url.pathname === path} class="nav-item" title={name}>
		<div class={icon} />
	</a>
{:else}
	<div class="nav-item" title={name}>
		<div class={icon} />
	</div>
{/if}
<slot />

<style lang="scss">
	.nav-item {
		--uno: no-underline text-current text-3xl p-1 px-2;
		--uno: border-1 border-solid rounded-lg;
		&.active {
			box-shadow: 0 0 5px black;
			transition: box-shadow 0.1s ease-in-out;
		}
		&:hover,
		&:active {
			filter: drop-shadow(0 0 3px limegreen);
			box-shadow: 0 0 3px limegreen;
			transition: box-shadow 0.1s ease-in-out;
			cursor: pointer;
		}
	}
</style>
