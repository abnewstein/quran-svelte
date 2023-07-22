<script lang="ts">
	import VerseNoteClicked from '$lib/actions/VerseNoteClicked.js';
	import { highlightWordInText } from '$lib/utils/utils.js';
	import { anyNotesVisible } from '$lib/store/VisibleNotesStore.js';
	import VerseNumberInfo, { type displayType } from './VerseNumberInfo.svelte';
	import Button from './ToggleButton.svelte';
	import VerseNotes from './VerseNotes.svelte';
	import { keyToString, parseKey } from '$lib/utils/VerseKeyUtils.js';

	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails = [];
	export let highlightWord: string | null = null;
	export let display: displayType = 'verse';

	let toggleAllNotesInVerse: () => void;
	let toggleByNoteIndex: (key: string) => void;

	let verseArText: string;
	let verseEnText: string;

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;
	const verseKey = `${chapterNumber}:${verseNumber}`;
	const verseRef: QuranRef.Verse = parseKey(verseKey) as QuranRef.Verse;

	$: verseArText = highlightWord
		? highlightWordInText(verse.ar.text, highlightWord)
		: verse.ar.text;
	$: verseEnText = highlightWord
		? highlightWordInText(verse.en.text, highlightWord)
		: verse.en.text;
	$: active = anyNotesVisible(verseKey);
</script>

<div class="ar-text" dir="rtl">
	<p>
		{@html verseArText}
	</p>
</div>
<div class="en-text" use:VerseNoteClicked={(key) => toggleByNoteIndex(keyToString(key))}>
	<p>
		<VerseNumberInfo reference={verseRef} {display} />
		{@html verseEnText}
	</p>
	{#if verseNotes.length > 0}
		<Button key={verseKey} class="self-baseline" onClick={toggleAllNotesInVerse} active={$active} />
	{/if}
</div>
{#if verseNotes.length > 0}
	<VerseNotes id={verseRef} {verseNotes} bind:toggleByNoteIndex bind:toggleAllNotesInVerse />
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
