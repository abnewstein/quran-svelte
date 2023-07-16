<script lang="ts">
	import { derived } from 'svelte/store';
	import VerseNumberInfo from './VerseNumberInfo.svelte';
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked.js';
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import Button from './ToggleButton.svelte';
	import VerseNotes, { visibleNotesStore } from './VerseNotes.svelte';
	import { highlightWordInText } from '$lib/utils/utils.js';

	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails;
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;
	export let highlightWord: string | null = null;

	let toggleAllNotesInVerse: () => void;
	let toggleNote: (key: number) => void;

	let verseArText: string;
	let verseEnText: string;

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;
	const verseKey = `${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey;

	$: verseArText = highlightWord
		? highlightWordInText(verse.ar.text, highlightWord)
		: verse.ar.text;
	$: verseEnText = highlightWord
		? highlightWordInText(verse.en.text, highlightWord)
		: verse.en.text;

	const areAllNotesVisible = derived(visibleNotesStore, ($store) =>
		$store[verseKey]?.every(Boolean)
	);
</script>

<div class="ar-text" dir="rtl">
	<p>
		{@html verseArText}
	</p>
</div>
<div class="en-text" use:VerseNoteClicked={(key) => toggleNote(Number(key.split(':')[2]))}>
	<p>
		<VerseNumberInfo {displayMode} {chapterNumber} {verseNumber} />
		{@html verseEnText}
	</p>
	{#if verseNotes.length > 0}
		<Button
			key={verseKey}
			class="self-baseline"
			onClick={toggleAllNotesInVerse}
			active={$areAllNotesVisible}
		/>
	{/if}
</div>
{#if verseNotes.length > 0}
	<VerseNotes id={verseKey} {verseNotes} bind:toggleNote bind:toggleAllNotesInVerse />
{/if}

<style lang="scss">
	div {
		p {
			--uno: prose my-0;
		}
		&.ar-text {
			--uno: text-right text-2xl;
		}
		&.en-text {
			--uno: text-xl leading-relaxed;
			--uno: flex justify-between;
		}
	}
</style>
