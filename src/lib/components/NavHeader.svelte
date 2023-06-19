<script lang="ts">
	import NavItem from './NavItem.svelte';
	import SearchBar from './SearchBar.svelte';
	const pageMap = {
		'/chapter': { name: 'Chapters', icon: 'i-ph-book-open-text-duotone', isLink: true },
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
			<NavItem {path} {name} {icon} {isLink} />
		{/each}
	</div>
	<SearchBar />
</nav>

<style lang="scss">
</style>
