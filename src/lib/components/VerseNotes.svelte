<script lang="ts" context="module">
	import { VersePreviewlinks } from '$lib/actions/VersePreviewLinks.js';
	import {
		visibleNotesStore,
		registerComponent,
		updateStore
	} from '$lib/store/VisibleNotesStore.js';
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let id: Quran.ChapterVerseKey;
	export let verseNotes: Quran.NoteDetails = [];

	const componentId = id.toString();
	const initialVisibleNotes = Array(verseNotes.length).fill(false);

	let anyNotesVisible = false;

	const cleanup = registerComponent(componentId, initialVisibleNotes);

	function toggleNoteVisibility(noteIndex: number) {
		updateStore(componentId, (notes) => {
			notes[noteIndex] = !notes[noteIndex];
		});
	}

	export function toggleNote(noteNumber: number) {
		toggleNoteVisibility(noteNumber - 1);
	}

	export function toggleAllNotesInVerse() {
		updateStore(componentId, (notes) => {
			const allVisible = notes.every(Boolean);
			notes.fill(!allVisible);
		});
	}

	$: if (browser) {
		anyNotesVisible = $visibleNotesStore[componentId].some(Boolean);
	}

	onMount(() => cleanup);
</script>

{#if anyNotesVisible}
	<ul>
		{#each verseNotes as note, index}
			{#if $visibleNotesStore[componentId][index]}
				<li use:VersePreviewlinks>
					{@html note.text}
					<button on:click={() => toggleNote(index + 1)}>X</button>
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
					--uno: text-blue-700;
				}
			}
		}
		--uno: border-1 border-solid border-blue-400 rounded p-1 bg-blue-100;
		box-shadow: 0 0 1px rgba(117, 0, 65, 0.793);
		list-style: none;
	}
</style>
