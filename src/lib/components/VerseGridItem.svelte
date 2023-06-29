<script lang="ts">
	import { goto } from '$app/navigation';
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked.js';
	import { VerseNoteStore } from '$lib/store/index.js';
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import Button from './ToggleButton.svelte';
	import VerseNotes from './VerseNotes.svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails;
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;

	const activeVerseNotes = writable<Quran.NoteDetail[]>([]);
	if (browser) {
		$activeVerseNotes = verseNotes?.filter((note) => VerseNoteStore.matches(note.id));
	}
</script>

<div class="ar-text" dir="rtl">
	<p>{verse.ar.text}</p>
</div>
<div class="en-text" use:VerseNoteClicked={(key) => VerseNoteStore.toggle(key)}>
	<p>
		{#if displayMode == DisplayVerseInfo.ChapterAndVerseNumber}
			<a
				href="/chapter/{chapterNumber}?verse={verseNumber}"
				target="_blank"
				on:click={() => goto(`/chapter/${chapterNumber}?verse=${verseNumber}`)}
			>
				<sup class="font-bold mr-1 text-xl">{chapterNumber}:{verseNumber}</sup>
			</a>
		{:else if displayMode == DisplayVerseInfo.VerseNumber}
			<sup class="font-bold mr-1">{verseNumber}</sup>
		{/if}
		{@html verse.en.text}
	</p>
	{#if verseNotes.length > 0}
		{#key $VerseNoteStore}
			<Button
				class="self-end"
				onClick={() => VerseNoteStore.toggleAllInVerse(chapterNumber, verseNumber)}
				active={$activeVerseNotes.length > 0}
			/>
		{/key}
	{/if}
</div>
{#if $activeVerseNotes.length > 0}
	<VerseNotes activeVerseNotes={$activeVerseNotes} />
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
