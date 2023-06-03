<script lang="ts">
	export let verseNotes: Quran.NoteDetails = [];
	export let verseKey: string = '';

	// deep clone the verseNotes prop
	$: verseNotesCopy = { ...verseNotes };
	const addNote = (noteNumber: number) => {
		verseNotesCopy = { ...verseNotesCopy, ...verseNotes[noteNumber] };
	};
	const removeNote = (noteNumber: number) => {
		verseNotes = verseNotesCopy.filter((n) => n.number !== noteNumber);
	};
</script>

{#if verseNotesCopy.length > 0}
	<div class="verse-notes-container">
		{#each verseNotesCopy as note}
			<span id="verse-note-{verseKey}:{note.number}"
				>{note.text}
				<button on:click={() => removeNote(note.number)}>X</button>
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
