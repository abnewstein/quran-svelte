<script lang="ts" context="module">
	import VersePreview from './VersePreview.svelte';
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
	import { writable } from 'svelte/store';

	export let id: Quran.ChapterVerseKey;
	export let verseNotes: Quran.NoteDetails = [];

	const componentId = id.toString();
	const initialVisibleNotes = Array(verseNotes.length).fill(false);

	let anyNotesVisible = false;
	let versePreviewStore = writable<Map<number, Set<Quran.ChapterVerseRange>>>(new Map());

	const cleanup = registerComponent(componentId, initialVisibleNotes);

	onMount(() => cleanup);

	function updateNoteVisibility(noteIndex: number, visibility: boolean) {
		updateStore(componentId, (notes) => {
			notes[noteIndex] = visibility;
		});
	}

	export function toggleByNoteIndex(noteNumber: number) {
		updateNoteVisibility(noteNumber - 1, !$visibleNotesStore[componentId][noteNumber - 1]);
	}

	export function toggleAllNotesInVerse() {
		const allVisible = $visibleNotesStore[componentId].every(Boolean);
		updateStore(componentId, (notes) => {
			notes.fill(!allVisible);
		});
	}

	$: anyNotesVisible = browser && $visibleNotesStore[componentId].some(Boolean);

	const handleVersePreview = (noteIndex: number) => (verseKey: Quran.ChapterVerseRange) => {
		const verseSet = $versePreviewStore.get(noteIndex) ?? new Set<Quran.ChapterVerseRange>();
		verseSet.has(verseKey) ? verseSet.delete(verseKey) : verseSet.add(verseKey);
		$versePreviewStore.set(noteIndex, verseSet);
		$versePreviewStore = new Map($versePreviewStore.entries());
	};
</script>

{#if anyNotesVisible}
	<ul>
		{#each verseNotes as note, index (note.id)}
			{#if $visibleNotesStore[componentId][index]}
				<li use:VersePreviewlinks={handleVersePreview(index)}>
					{@html note.text}
					<button on:click={() => toggleByNoteIndex(index + 1)}>X</button>
					<VersePreview
						verseRangeList={[...($versePreviewStore.get(index) || [])]}
						on:remove={(event) => {
							const set = $versePreviewStore.get(index);
							set?.delete(event.detail);
							$versePreviewStore = new Map($versePreviewStore.entries());
						}}
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
