<script lang="ts">
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import { goto } from '$app/navigation';

	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;
	export let chapterNumber: number;
	export let verseNumber: number;

	const verseKey = `${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey;
	const gotoVerse = () => goto(`/chapter/${chapterNumber}?verse=${verseNumber}`);
</script>

{#if displayMode == DisplayVerseInfo.ChapterAndVerseNumber}
	<button on:click={gotoVerse}>
		<sup class="font-bold mr-1 text-xl">{verseKey}</sup>
	</button>
{:else if displayMode == DisplayVerseInfo.VerseNumber}
	<sup class="font-bold mr-1">{verseNumber}</sup>
{/if}

<style lang="scss">
	button {
		--uno: bg-transparent border-none p-0 cursor-pointer color-blue-700;
		&:hover {
			text-decoration: underline;
		}
	}
</style>
