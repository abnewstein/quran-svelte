import { writable } from 'svelte/store';

export const visibleNotesStore = writable<Record<string, boolean[]>>({});

export function updateStore(componentId: string, updater: (notes: boolean[]) => void) {
	visibleNotesStore.update((store) => {
		const notes = store[componentId];
		updater(notes);
		return store;
	});
}

export function registerComponent(componentId: string, initialVisibleNotes: boolean[]) {
	visibleNotesStore.update((store) => ({ ...store, [componentId]: initialVisibleNotes }));

	return () => {
		visibleNotesStore.update((store) => {
			delete store[componentId];
			return store;
		});
	};
}

export function toggleAllNotesInChapter() {
	visibleNotesStore.update((store) => {
		const allVisible = Object.values(store)[0].some(Boolean);
		for (const verse of Object.values(store)) {
			verse.fill(!allVisible);
		}
		return store;
	});
}
