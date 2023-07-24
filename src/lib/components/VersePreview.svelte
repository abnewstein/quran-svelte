<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { QuranStore } from '$lib/store/QuranStore.js';

	export let verseRangeList: Array<QuranRef.VerseRange> | undefined;

	const { getVerses } = QuranStore;
	const dispatch = createEventDispatcher();
</script>

{#if verseRangeList && verseRangeList.length > 0}
	<div>
		{#each verseRangeList as verseRangeStr}
			{@const reference = verseRangeStr}
			{@const verses = getVerses(reference)}
			<ul>
				{#each verses as verse}
					{@const verseEnText = verse.en.text
						.replace(/<[^>]*>([^<]*)<\/[^>]*>/g, '')
						.replace(/<[^>]*>/g, '')}
					{@const chapterVerseKey = `${verse.ar.chapterNumber}:${verse.ar.verseNumber}`}
					<li>
						<p><strong>{chapterVerseKey} - </strong>{verseEnText}</p>
					</li>
				{/each}
				<button on:click={() => dispatch('remove', verseRangeStr)}>X</button>
			</ul>
		{/each}
	</div>
{/if}

<style lang="scss">
	div {
		--uno: flex flex-col gap-1 my-2;
		ul {
			li {
				--uno: rounded-lg px-2 m-0;
				p {
					--uno: mx-1 my-2 color-black;
				}
			}
			--uno: border-1 border-solid border-black rounded-lg bg-white;
			--uno: p-1;
			list-style: none;
		}
	}
</style>
