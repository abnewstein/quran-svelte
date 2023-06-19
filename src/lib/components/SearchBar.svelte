<script lang="ts">
	// The user's search query
	let searchQuery = '';

	const search = () => {
		if (!searchQuery.trim()) {
			console.warn('Cannot search with an empty query');
			return;
		}

		console.log(`Searching for "${searchQuery}"`);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			search();
		}
	};
</script>

<div class="search-bar" flex="~ items-center" border="1 solid black rounded">
	<input
		type="text"
		bind:value={searchQuery}
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
			--uno: m-x-0.5 p-2 bg-white border-1 rounded border-y-none;
			&:hover {
				--uno: bg-lime-200;
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
			--uno: shadow-md shadow-black;
		}
	}
</style>
