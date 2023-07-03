<script lang="ts" context="module">
	export enum DisplayVerseInfo {
		None,
		VerseNumber,
		ChapterAndVerseNumber
	}
</script>

<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import VerseGridItem from './VerseGridItem.svelte';
	export let chapterNumber: number | null = null;
	export let verses: Quran.VersePair[];
	export let highlightVerseNumber: number | null = null;
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;

	afterNavigate(() => {
		if (highlightVerseNumber) {
			const verse = document.getElementById(`${chapterNumber}:${highlightVerseNumber}`);
			if (verse) {
				verse.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
</script>

<ul class="p-0 m-0">
	{#each verses as verse (`${verse.ar.chapterNumber}:${verse.ar.verseNumber}`)}
		{@const verseNotes = verse?.en?.notes ?? []}
		<li
			id={`${verse.ar.chapterNumber}:${verse.ar.verseNumber}`}
			class:highlight={verse.ar.verseNumber == highlightVerseNumber}
		>
			<VerseGridItem {verse} {verseNotes} {displayMode} />
		</li>
	{/each}
</ul>

<style lang="scss">
	li {
		--uno: grid gap-4 rounded-lg p-1 mb-2;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}
		&.highlight {
			--uno: bg-yellow-200;
		}
	}
</style>
