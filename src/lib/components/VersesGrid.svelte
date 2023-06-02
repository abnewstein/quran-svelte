<script lang="ts">
	import { quranDataStore } from '$lib/store';

	export let chapterNumber: number;
	$: verseDataEn = quranDataStore.getVersesEn;
	$: verseDataAr = quranDataStore.getVersesAr;
	$: firstVerse = quranDataStore.firstVersePair;
</script>

<div class="verses-grid">
	{#if chapterNumber !== 1}
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
		{@const verseNotes = verseEn?.notes}
		<p class="ar-text" dir="rtl">
			{verse.text}
		</p>
		<p class="en-text">
			<sup class="font-bold mr-1">{index + 1}</sup>
			{@html verseTextEn}
		</p>
		{#if verseNotes && verseNotes.length > 0}
			<div class="verse-notes-container">
				{#each verseNotes as note}
					<span>{note.text}</span>
				{/each}
			</div>
		{/if}
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
	.verse-notes-container {
		--uno: grid grid-cols-1 gap-1;
		grid-column: span 2;
		span {
			--uno: text-sm rounded-lg p-1 bg-lightblue-100;
			border-bottom: 1px dashed cadetblue;
			border-top: 1px dashed cadetblue;
		}
		--uno: border-1 border-solid border-blue-400 rounded p-1 bg-blue-100;
		box-shadow: 0 0 1px blue;
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
