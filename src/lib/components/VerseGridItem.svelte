<script lang="ts">
	import { derived } from 'svelte/store';
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked.js';
	import { highlightWordInText } from '$lib/utils/utils.js';
	import { visibleNotesStore } from '$lib/store/VisibleNotesStore.js';
	import VerseNumberInfo from './VerseNumberInfo.svelte';
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import Button from './ToggleButton.svelte';
	import VerseNotes from './VerseNotes.svelte';

	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails = [];
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;
	export let highlightWord: string | null = null;

	let toggleAllNotesInVerse: () => void;
	let toggleByNoteIndex: (key: number) => void;

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
<div class="en-text" use:VerseNoteClicked={(key) => toggleByNoteIndex(Number(key.split(':')[2]))}>
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
	<VerseNotes id={verseKey} {verseNotes} bind:toggleByNoteIndex bind:toggleAllNotesInVerse />
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
