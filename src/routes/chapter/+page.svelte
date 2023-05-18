<script lang="ts">
	import { quranDataStore } from '$lib/QuranData';
	import { get } from 'svelte/store';

	const quranData = get(quranDataStore);
	const chapters = quranData?.getChapters();
</script>

<div class="p-5 gap-3" grid="~ cols-1 sm:cols-2 md:cols-3 lg:cols-4 xl:cols-6">
	{#if !chapters}
		<div flex="~ flex-col items-center justify-center">
			<span>Loading...</span>
		</div>
	{:else}
		{#each chapters as chapter (chapter.number)}
			<a class="chapter-card" href="/chapter/{chapter.number}">
				<div>
					<strong class="text-xl">{chapter.number}</strong>
					<p>
						{chapter.name.arabic} | <small>{chapter.name.transliteration}</small>
					</p>
					<p>{chapter.name.english}</p>
					<span class="verse-count">{chapter.versesCount} verses</span>
				</div>
			</a>
		{/each}
	{/if}
</div>

<style lang="scss">
	a.chapter-card {
		@apply block relative rounded-xl bg-white p-4 pb-6 border-solid border-1 border-black shadow-md no-underline text-current;

		&:hover {
			box-shadow: 0 0 7px #1c1917;
			transition: box-shadow 0.1s ease-in-out;
		}

		div {
			@apply flex flex-col items-center text-center;

			p {
				@apply prose-stone mb-2 mt-0;

				&:last-of-type {
					@apply font-bold mb-3;
				}

				small {
					@apply font-italic;
				}
			}
		}

		.verse-count {
			@apply bottom-1 absolute text-xs prose-stone border-solid border-black border-1 rounded-lg py-1 px-2;
		}
	}
</style>
