<script lang="ts">
	import { onMount } from 'svelte';
	import VersePreviewLinks from '$lib/actions/VersePreviewLinks.js';
	import { VisibleNotesStore, anyNotesVisible } from '$lib/store/VisibleNotesStore.js';
	import { createVersePreviewStore } from '$lib/store/VersePreviewStore.js';
	import VersePreview from './VersePreview.svelte';
	import { keyToString, parseKey } from '$lib/utils/VerseKeyUtils.js';

	export let id: QuranRef.Verse;
	export let verseNotes: Quran.NoteDetails = [];

	const componentId = keyToString(id);
	const initialVisibleNotes = Array(verseNotes.length).fill(false);

	let versePreviewStore = createVersePreviewStore();

	const cleanup = VisibleNotesStore.registerComponent(componentId, initialVisibleNotes);

	onMount(() => cleanup);

	export function toggleByNoteIndex(noteRef: string) {
		VisibleNotesStore.toggleByNoteRef(parseKey(noteRef) as QuranRef.Note);
	}

	export function toggleAllNotesInVerse() {
		VisibleNotesStore.toggleAllNotesInComponent(id);
	}

	const handleVersePreview = (noteId: string, targetVerseRef: QuranRef.Verse) => {
		const noteRef = parseKey(noteId) as QuranRef.Note;
		versePreviewStore.toggleVerseInSet(noteRef, targetVerseRef);
	};

	const handleRemoveVerseFromSet = (noteId: string, targetVerseRef: QuranRef.Verse) => {
		const noteRef = parseKey(noteId) as QuranRef.Note;
		versePreviewStore.removeVerseFromSet(noteRef, targetVerseRef);
	};

	$: show = anyNotesVisible(componentId);
</script>

{#if $show}
	<ul>
		{#each verseNotes as note, index (note.id)}
			{@const noteRef = note.id}
			{#if $VisibleNotesStore[componentId][index]}
				<li use:VersePreviewLinks={(key) => handleVersePreview(noteRef, key)}>
					{@html note.text}
					<button on:click={() => toggleByNoteIndex(noteRef)}>X</button>
					<VersePreview
						verseRangeList={$versePreviewStore[note.id]}
						on:remove={(event) => handleRemoveVerseFromSet(noteRef, event.detail)}
					/>
				</li>
			{/if}
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

			:global(a) {
				--uno: text-blue-500;
				&:hover {
					--uno: text-blue-700 cursor-pointer;
				}
			}
		}
		--uno: border-1 border-solid border-blue-400 rounded p-1 bg-blue-100;
		box-shadow: 0 0 1px rgba(117, 0, 65, 0.793);
		list-style: none;
	}
</style>
