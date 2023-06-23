<script lang="ts">
	import VerseGridItem from './VerseGridItem.svelte';
	import { onMount } from 'svelte';

	export let chapterNumber: number | null = null;
	export let verses: Quran.VersePair[];
	export let highlightVerseNumber: number | null = null;
	export let hideVerseNumber: boolean = false;
	export let showChapterNumber: boolean = false;

	onMount(() => {
		if (highlightVerseNumber) {
			const verse = document.getElementById(`verse-${chapterNumber}:${highlightVerseNumber}`);
			if (verse) {
				verse.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
</script>

<ul p-0>
	{#each verses as verse, index (verse.ar.id)}
		{@const verseNotes = verse?.en?.notes ?? []}
		<li
			id="verse-{verse.ar.chapterNumber}:{verse.ar.verseNumber}"
			class:highlight={verse.ar.verseNumber == highlightVerseNumber}
		>
			<VerseGridItem {verse} {verseNotes} {hideVerseNumber} {showChapterNumber} />
		</li>
	{/each}
</ul>

<style lang="scss">
	li {
		--uno: grid items-baseline gap-4 rounded-lg p-1;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}

		&.highlight {
			--uno: bg-yellow-200;
		}
	}
</style>
