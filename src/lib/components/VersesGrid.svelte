<script lang="ts">
	import VerseNotes from './VerseNotes.svelte';
	import { quranDataStore } from '$lib/store';
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked';

	export let chapterNumber: number;
	$: verseDataEn = quranDataStore.getVersesEn;
	$: verseDataAr = quranDataStore.getVersesAr;
	$: firstVerse = quranDataStore.firstVersePair;
	const verseNotesList: Quran.NoteDetails = [];
</script>

<div class="verses-grid">
	{#if chapterNumber !== 1 && chapterNumber !== 9}
		<p class="ar-text" dir="rtl">
			{$firstVerse?.ar?.text}
		</p>
		<p class="en-text">
			{@html $firstVerse?.en?.text}
		</p>
	{/if}
	{#each $verseDataAr(chapterNumber) as verse, index}
		{@const verseEn = $verseDataEn(chapterNumber)[index]}
		{@const verseTextEn = verseEn?.text}
		{@const verseNotes = verseEn?.notes ?? []}
		<p class="ar-text" dir="rtl">
			{verse.text}
		</p>
		<p class="en-text" use:VerseNoteClicked>
			<sup class="font-bold mr-1">{verse.verseNumber}</sup>
			{@html verseTextEn}
		</p>
		<VerseNotes {verseNotes} verseKey="{verse.chapterNumber}:{verse.verseNumber}" />
	{/each}
</div>

<style lang="scss">
	.verses-grid {
		--uno: grid items-baseline gap-4 rounded p-1;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}
	}

	p {
		--uno: prose my-0;
		&.ar-text {
			--uno: text-right text-2xl;
		}
		&.en-text {
			--uno: text-xl;
		}
	}
</style>
