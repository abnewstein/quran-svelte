<script lang="ts">
	import VerseNumberInfo from './VerseNumberInfo.svelte';
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked.js';
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import Button from './ToggleButton.svelte';
	import VerseNotes, { visibleNotesStore } from './VerseNotes.svelte';
	import { derived } from 'svelte/store';

	export let verse: Quran.VersePair;
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;
	export let highlightWord: string | null = null;
	export let showNotesToggle: boolean = false;

	let toggleAllNotesInVerse: () => void;
	let toggleNote: (key: number) => void;
	let verseArText: string;
	let verseEnText: string;

	function highlightWordInText(text: string, word: string) {
		return text.replace(new RegExp(word, 'gi'), `<mark>${word}</mark>`);
	}

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;
	const verseKey = `${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey;

	$: verseArText = highlightWord ? highlightWordInText(verseArText, highlightWord) : verse.ar.text;
	$: verseEnText = highlightWord ? highlightWordInText(verseEnText, highlightWord) : verse.en.text;

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
	{#if showNotesToggle}
		<Button
			key={verseKey}
			class="self-baseline"
			onClick={toggleAllNotesInVerse}
			active={$areAllNotesVisible}
		/>
	{/if}
</div>
<slot {VerseNotes} />

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
