<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { activeVerseNotes } from '$lib/store';
	export let verseNotes: Quran.NoteDetails = [];

	const handleClick = (noteId: Quran.VerseNoteKey) => {
		$activeVerseNotes.delete(noteId);
		$activeVerseNotes = new Set($activeVerseNotes);
	};
</script>

{#if verseNotes.length > 0}
	<div class="verse-notes-container" transition:slide={{ duration: 200, easing: quintOut }}>
		{#each verseNotes as note}
			<span>
				{note.text}
				<button on:click={() => handleClick(note.id)}>X</button>
			</span>
		{/each}
	</div>
{/if}

<style lang="scss">
	.verse-notes-container {
		--uno: grid grid-cols-1 gap-1;
		grid-column: span 2;
		span {
			--uno: text-sm rounded-lg p-1 bg-lightblue-100;
			border-bottom: 1px solid cadetblue;
			border-top: 1px solid cadetblue;
		}
		--uno: border-1 border-solid border-blue-400 rounded p-1 bg-blue-100;
		box-shadow: 0 0 1px rgba(117, 0, 65, 0.793);
	}
</style>
