<script lang="ts">
	import { VerseNoteClicked } from '$lib/actions/VerseNoteClicked';
	import { activeVerseNotes } from '$lib/store';
	import VerseNotes from './VerseNotes.svelte';
	export let verseAr: Quran.Verse;
	export let verseEn: Quran.Verse;
	export let verseNotes: Quran.NoteDetails;
	export let hideVerseNumber: boolean = false;

	const handleNoteClick = (key: Quran.VerseNoteKey) => {
		if ($activeVerseNotes.has(key)) {
			$activeVerseNotes.delete(key);
		} else {
			$activeVerseNotes.add(key);
		}
		$activeVerseNotes = new Set($activeVerseNotes);
	};
</script>

<p class="ar-text" dir="rtl">
	{verseAr.text}
</p>
<p class="en-text" use:VerseNoteClicked={handleNoteClick}>
	{#if !hideVerseNumber}
		<sup class="font-bold mr-1">{verseEn.verseNumber}</sup>
	{/if}
	{@html verseEn.text}
</p>
{#if verseNotes && verseNotes.length > 0}
	{#if $activeVerseNotes.size > 0}
		{@const notes = verseNotes?.filter((note) => $activeVerseNotes.has(note.id))}
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
	}
</style>
