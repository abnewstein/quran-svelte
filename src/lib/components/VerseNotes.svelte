<script lang="ts">
	import { onMount } from 'svelte';
	import VersePreviewLinks from '$lib/actions/VersePreviewLinks.js';
	import { VisibleNotesStore, anyNotesVisible } from '$lib/store/VisibleNotesStore.js';
	import { createVersePreviewStore } from '$lib/store/VersePreviewStore.js';
	import VersePreview from './VersePreview.svelte';

	export let id: Quran.ChapterVerseKey;
	export let verseNotes: Quran.NoteDetails = [];

	const componentId = id.toString();
	const initialVisibleNotes = Array(verseNotes.length).fill(false);

	let versePreviewStore = createVersePreviewStore();

	const cleanup = VisibleNotesStore.registerComponent(componentId, initialVisibleNotes);

	onMount(() => cleanup);

	export function toggleByNoteIndex(noteNumber: number) {
		VisibleNotesStore.toggleByNoteIndex(componentId, noteNumber - 1);
	}

	export function toggleAllNotesInVerse() {
		VisibleNotesStore.toggleAllNotesInComponent(componentId);
	}

	const handleVersePreview = (noteIndex: number) => (verseKey: Quran.ChapterVerseRange) => {
		versePreviewStore.toggleVerseInSet(noteIndex, verseKey);
	};

	const show = anyNotesVisible(componentId);
</script>

{#if $show}
	<ul>
		{#each verseNotes as note, index (note.id)}
			{#if $VisibleNotesStore[componentId][index]}
				<li use:VersePreviewLinks={handleVersePreview(index)}>
					{@html note.text}
					<button on:click={() => toggleByNoteIndex(index + 1)}>X</button>
					<VersePreview
						verseRangeList={$versePreviewStore.get(index)}
						on:remove={(event) => versePreviewStore.removeVerseFromSet(index, event.detail)}
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
