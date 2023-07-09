<script lang="ts">
	import { goto } from '$app/navigation';

	let searchTerm = '';
	let input: HTMLInputElement;
	const search = () => {
		if (!searchTerm.trim()) {
			console.warn('Cannot search with an empty query');
			return;
		}
		goto(`/search?q=${searchTerm}`);
	};

	const clearSearch = () => {
		searchTerm = '';
		input.focus();
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			search();
		}
	};
</script>

<form>
	<input
		type="text"
		bind:value={searchTerm}
		bind:this={input}
		on:keydown={handleKeydown}
		placeholder="Search across the Quran"
	/>
	{#if searchTerm.trim()}
		<button on:click={clearSearch} class="clear-button">
			<div class="i-ph-x-light" />
		</button>
	{/if}
	<button on:click={search} class="search-button">
		<div class="i-ph-magnifying-glass" />
	</button>
</form>

<style lang="scss">
	form {
		background-color: #fff;
		height: 2.25rem;
		--uno: flex items-center;
		--uno: border-1 border-solid border-black rounded-lg p-1;

		&:hover,
		&:active {
			--uno: shadow-md shadow-lime-500;
		}
		&:focus-within {
			--uno: shadow-md shadow-coolgray-500;
		}

		input {
			--uno: m-0 outline-none border-none h-full;
		}

		button {
			--uno: m-x-0.5 p-2 bg-white border-none rounded-lg cursor-pointer;
			&:active {
				--uno: color-white bg-black;
			}
			&.search-button {
				--uno: border-1 border-y-none;
				&:hover {
					--uno: bg-lime-200;
				}
			}
			&.clear-button {
				&:hover {
					--uno: bg-red-200;
				}
			}
		}
	}
</style>
