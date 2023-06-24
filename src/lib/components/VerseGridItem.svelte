<script lang="ts">
	import { goto } from '$app/navigation';
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked.js';
	import { VerseNoteStore } from '$lib/store/index.js';
	import { DisplayVerseInfo } from './VerseGrid.svelte';
	import VerseNotes from './VerseNotes.svelte';
	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails;
	export let displayMode: DisplayVerseInfo = DisplayVerseInfo.None;

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;
</script>

<p class="ar-text" dir="rtl">
	{verse.ar.text}
</p>
<p class="en-text" use:VerseNoteClicked={(key) => VerseNoteStore.toggle(key)}>
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
{#if verseNotes && verseNotes.length > 0}
	{#if $VerseNoteStore.expanded.size > 0}
		{@const notes = verseNotes?.filter((note) => {
			return (
				($VerseNoteStore.expanded.has(note.id) && !$VerseNoteStore.collapsed.has(note.id)) ||
				VerseNoteStore.matches(note.id)
			);
		})}
		<VerseNotes verseNotes={notes} />
	{/if}
{/if}

<style lang="scss">
	p {
		--uno: prose my-0;
		&.ar-text {
			--uno: text-right text-2xl;
		}
		&.en-text {
			--uno: text-xl leading-relaxed;
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
