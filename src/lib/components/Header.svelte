<script lang="ts">
	import { page } from '$app/stores';
	const pageMap = {
		'/chapter': { name: 'Chapters', icon: 'i-ph-book-open-text-duotone', isLink: true },
		'/search': { name: 'Search', icon: 'i-ph-magnifying-glass', isLink: false },
		'/about': { name: 'About', icon: 'i-ph-identification-card', isLink: true }
	};
</script>

<nav
	class={`top-0 z-50 p-5 bg-gray-100 ${$$props.class}`}
	grid="~ cols-1 gap-4 justify-items-center"
>
	<div>
		<a href="/" class="font-bold no-underline text-current text-3xl p-2">القرآن - Al Qur'an</a>
	</div>
	<div class="flex space-x-6">
		{#each Object.entries(pageMap) as [path, { name, icon, isLink }]}
			{#if isLink}
				<a href={path} class:active={$page.url.pathname === path} class="nav-item" title={name}>
					<div class={icon} />
				</a>
			{:else}
				<div class="nav-item" title={name}>
					<div class={icon} />
				</div>
			{/if}
		{/each}
	</div>
</nav>

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
