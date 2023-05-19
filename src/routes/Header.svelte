<script lang="ts">
	import { page } from '$app/stores';

	const pageMap = {
		'/': { name: 'Home', icon: 'i-ph-house' },
		'/chapter': { name: 'Chapter', icon: 'i-ph-book-open-text-duotone' },
		'/about': { name: 'About', icon: 'i-ph-identification-card' }
	};
</script>

<nav class="flex items-center justify-between p-5 bg-gray-100">
	<div class="flex space-x-6">
		{#each Object.entries(pageMap) as [path, { name, icon }]}
			<a href={path} class:active={$page.url.pathname === path} class="nav-item">
				<div class={icon} />
			</a>
		{/each}
	</div>
	<div>
		<a href="/" class="font-bold">القرآن - Al Qur'an</a>
	</div>
</nav>

<style lang="scss">
	a.nav-item {
		@apply no-underline text-current text-3xl p-1 px-2;
		@apply border-1 border-solid rounded-lg;
		&.active {
			// filter: drop-shadow(0 0 1px blueviolet);
			box-shadow: 0 0 3px blueviolet;
			transition: box-shadow 0.1s ease-in-out;
		}
		&:hover {
			filter: drop-shadow(0 0 3px limegreen);
			box-shadow: 0 0 3px limegreen;
			transition: box-shadow 0.1s ease-in-out;
		}
	}
</style>
