<script lang="ts">
	import { QuranStore } from '$lib/store/QuranStore.js';
	import { parseChapterVerseRange } from '$lib/utils/VerseKeyUtils.js';

	export let verseKey: Quran.ChapterVerseRange;

	const { getVersesByRange } = QuranStore;
	const { chapterNumber, verseRange } = parseChapterVerseRange(verseKey);
	const verses = getVersesByRange(chapterNumber, verseRange);

	const close = () => {};
</script>

<ul>
	{#each verses as verse}
		{@const verseEnText = verse.en.text
			.replace(/<[^>]*>([^<]*)<\/[^>]*>/g, '')
			.replace(/<[^>]*>/g, '')}
		{@const chapterVerseKey = `${verse.ar.chapterNumber}:${verse.ar.verseNumber}`}
		<li>
			<p><strong>{chapterVerseKey} - </strong>{verseEnText}</p>
			<button on:click={close}>X</button>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		li {
			--uno: flex justify-between items-center;
			--uno: text-lg rounded-lg px-2 m-0;
			border-bottom: 1px solid greenyellow;
			border-top: 1px solid greenyellow;

			p {
				--uno: mx-1 my-2;
			}
		}
		--uno: bg-gradient-to-l from-green-50 from-10% via-green-100 via-95% to-green-200;
		--uno: border-2 border-solid border-green-300 rounded p-1;
		list-style: none;
	}
</style>
