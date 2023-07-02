<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	export const visibleNotesStore = writable<Record<string, Array<boolean>>>({});

	function updateNotesForId(id: string, updater: (notes: Array<boolean>) => void) {
		visibleNotesStore.update((store) => {
			const notes = store[id];
			updater(notes);
			return store;
		});
	}

	function registerComponent(componentId: string, initialVisibleNotes: Array<boolean>) {
		visibleNotesStore.update((store) => ({ ...store, [componentId]: initialVisibleNotes }));
		return () =>
			visibleNotesStore.update((store) => {
				delete store[componentId];
				return store;
			});
	}

	export function toggleAllNotesInChapter() {
		visibleNotesStore.update((store) => {
			const state = Object.values(store);
			const firstVerseNotes = state[0];
			const allVisible = firstVerseNotes.some(Boolean);
			for (const verse of state) {
				verse.fill(!allVisible);
			}
			return store;
		});
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let id: Quran.ChapterVerseKey;
	export let verseNotes: Quran.NoteDetails = [];

	const componentId = id.toString();
	const initialVisibleNotes = Array(verseNotes.length).fill(false);

	const cleanup = registerComponent(componentId, initialVisibleNotes);

	export function toggleNote(noteNumber: number) {
		updateNotesForId(componentId, (notes) => {
			notes[noteNumber - 1] = !notes[noteNumber - 1];
		});
	}

	export function toggleAllNotesInVerse() {
		updateNotesForId(componentId, (notes) => {
			const allVisible = notes.every(Boolean);
			notes.fill(!allVisible);
		});
	}

	let anyNotesVisible = false;
	$: if (browser) {
		anyNotesVisible = $visibleNotesStore[componentId].some(Boolean);
	}

	onMount(() => cleanup);
</script>

{#if anyNotesVisible}
	<ul>
		{#each verseNotes as note, index}
			{#if $visibleNotesStore[componentId][index]}
				<li>
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
		}
		--uno: border-1 border-solid border-blue-400 rounded p-1 bg-blue-100;
		box-shadow: 0 0 1px rgba(117, 0, 65, 0.793);
		list-style: none;
	}
</style>
