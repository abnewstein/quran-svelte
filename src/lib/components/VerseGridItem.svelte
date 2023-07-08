<script lang="ts">
	import VerseNumberInfo from './VerseNumberInfo.svelte';

	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked.js';
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import Button from './ToggleButton.svelte';
	import VerseNotes, { visibleNotesStore } from './VerseNotes.svelte';
	import { derived } from 'svelte/store';
	import { goto } from '$app/navigation';

	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails;
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;

	let toggleAllNotesInVerse: () => void;
	let toggleNote: (key: number) => void;

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;
	const verseKey = `${chapterNumber}:${verseNumber}` as Quran.ChapterVerseKey;

	const areAllNotesVisible = derived(visibleNotesStore, ($store) =>
		$store[verseKey]?.every(Boolean)
	);
</script>

<div class="ar-text" dir="rtl">
	<p>{verse.ar.text}</p>
</div>
<div class="en-text" use:VerseNoteClicked={(key) => toggleNote(Number(key.split(':')[2]))}>
	<p>
		<VerseNumberInfo {displayMode} {chapterNumber} {verseNumber} />
		{@html verse.en.text}
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
	<VerseNotes id={verseKey} {verseNotes} bind:toggleAllNotesInVerse bind:toggleNote />
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

			button {
				--uno: bg-transparent border-none p-0 cursor-pointer color-blue-700;
				&:hover {
					text-decoration: underline;
				}
			}
		}

		:global(.verse-note > button) {
			--uno: px-2px rounded-lg decoration-none text-blue-500 border-none outline-none bg-transparent;
			&:hover {
				--uno: bg-gray-800 text-white cursor-pointer;
			}
			&:active {
				--uno: bg-gray-300 text-black;
			}
		}
	}
</style>
