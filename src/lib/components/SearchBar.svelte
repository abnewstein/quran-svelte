<script lang="ts">
	import { goto } from '$app/navigation';

	let searchTerm = '';
	const search = () => {
		if (!searchTerm.trim()) {
			console.warn('Cannot search with an empty query');
			return;
		}
		goto(`/search?q=${searchTerm}`, { replaceState: true });
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			search();
		}
	};
</script>

<div class="search-bar" flex="~ items-center" border="1 solid black rounded-lg">
	<input
		type="text"
		bind:value={searchTerm}
		on:keydown={handleKeydown}
		placeholder="Search across the Quran"
	/>
	<button on:click={search}>
		<div class="i-ph-magnifying-glass" />
	</button>
</div>

<style lang="scss">
	.search-bar {
		background-color: #fff;
		height: 2.25rem;
		input {
			--uno: m-1 outline-none border-none text-md;
		}
		button {
			--uno: m-x-0.5 p-2 bg-white border-1 rounded-lg border-y-none;
			&:hover {
				--uno: bg-lime-500;
				cursor: pointer;
			}
			&:active {
				--uno: color-lime-500 bg-black;
				cursor: pointer;
			}
		}
		&:hover,
		&:active {
			--uno: shadow-md shadow-lime-500;
		}
		&:focus-within {
			--uno: shadow-md shadow-coolgray-500;
		}
	}
</style>
