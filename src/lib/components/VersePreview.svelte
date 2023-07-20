<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { QuranStore } from '$lib/store/QuranStore.js';
	import { parseChapterVerseRange } from '$lib/utils/VerseKeyUtils.js';

	export let verseRangeList: Array<Quran.ChapterVerseRange> | undefined;

	const { getVersesByRange } = QuranStore;
	const dispatch = createEventDispatcher();
</script>

{#if verseRangeList}
	<div>
		{#each verseRangeList as verseRangeStr}
			{@const { chapterNumber, verseRange } = parseChapterVerseRange(verseRangeStr)}
			{@const verses = getVersesByRange(chapterNumber, verseRange)}
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
				--uno: text-lg rounded-lg px-2 m-0;
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
