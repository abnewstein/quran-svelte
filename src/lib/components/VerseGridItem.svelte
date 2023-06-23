<script lang="ts">
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked';
	import { VerseNoteStore } from '$lib/store';
	import VerseNotes from './VerseNotes.svelte';
	export let verse: Quran.VersePair;
	export let verseNotes: Quran.NoteDetails;
	export let hideVerseNumber: boolean = false;
	export let showChapterNumber: boolean = false;

	const chapterNumber = verse.ar.chapterNumber;
	const verseNumber = verse.ar.verseNumber;
</script>

<p class="ar-text" dir="rtl">
	{verse.ar.text}
</p>
<p class="en-text" use:VerseNoteClicked={(key) => VerseNoteStore.toggle(key)}>
	{#if showChapterNumber}
		<sup class="font-bold mr-1">{chapterNumber} : {verseNumber}</sup>
	{:else if !hideVerseNumber}
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
