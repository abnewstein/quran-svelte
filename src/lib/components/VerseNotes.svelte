<script lang="ts">
	import { VerseNoteStore } from '$lib/store/index.js';
	export let verseNotes: Quran.NoteDetails = [];
</script>

{#if verseNotes.length > 0}
	<ul>
		{#each verseNotes as note}
			<li>
				{@html note.text}
				<button on:click={() => VerseNoteStore.remove(note.id)}>X</button>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	ul {
		--uno: grid grid-cols-1 gap-1;
		grid-column: span 2;
		li {
			--uno: text-sm rounded-lg p-1 bg-lightblue-100;
			border-bottom: 1px solid cadetblue;
			border-top: 1px solid cadetblue;
		}
		--uno: border-1 border-solid border-blue-400 rounded p-1 bg-blue-100;
		box-shadow: 0 0 1px rgba(117, 0, 65, 0.793);
		list-style: none;
	}
</style>
