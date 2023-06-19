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
			--uno: shadow-md shadow-black;
		}
		&:hover,
		&:active {
			--uno: shadow-md shadow-lime-500;
			cursor: pointer;
		}
	}
</style>
