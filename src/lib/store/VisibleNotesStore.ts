import { derived, writable } from 'svelte/store';

type VisibleNotesStoreType = Record<string, boolean[]>;

type VisibleNotesStore = {
	subscribe: (
		run: (value: VisibleNotesStoreType) => void,
		invalidate?: (value?: VisibleNotesStoreType) => void
	) => () => void;
	registerComponent: (componentId: string, initialVisibleNotes: boolean[]) => () => void;
	updateNoteVisibility: (componentId: string, noteIndex: number, visibility: boolean) => void;
	toggleByNoteIndex: (componentId: string, noteIndex: number) => void;
	toggleAllNotesInComponent: (componentId: string) => void;
	toggleAllNotes: () => void;
};

function createVisibleNotesStore(): VisibleNotesStore {
	const { subscribe, update } = writable<VisibleNotesStoreType>({});

	return {
		subscribe,
		registerComponent: (componentId: string, initialVisibleNotes: boolean[]) => {
			update((store) => ({ ...store, [componentId]: initialVisibleNotes }));

			return () => {
				update((store) => {
					delete store[componentId];
					return store;
				});
			};
		},
		updateNoteVisibility: (componentId: string, noteIndex: number, visibility: boolean) => {
			update((store) => {
				const notes = store[componentId];
				notes[noteIndex] = visibility;
				return store;
			});
		},
		toggleByNoteIndex: (componentId: string, noteIndex: number) => {
			update((store) => {
				const notes = store[componentId];
				notes[noteIndex] = !notes[noteIndex];
				return store;
			});
		},
		toggleAllNotesInComponent: (componentId: string) => {
			update((store) => {
				const notes = store[componentId];
				const allVisible = notes.every(Boolean);
				notes.fill(!allVisible);
				return store;
			});
		},
		toggleAllNotes: () => {
			update((store) => {
				const allVisible = Object.values(store).every((notes) => notes.every(Boolean));
				for (const notes of Object.values(store)) {
					notes.fill(!allVisible);
				}
				return store;
			});
		}
	};
}

export const VisibleNotesStore = createVisibleNotesStore();

export const getComponentNotes = (componentId: string) =>
	derived(VisibleNotesStore, ($store) => $store[componentId]);

export const anyNotesVisible = (componentId: string) =>
	derived(VisibleNotesStore, ($store) => {
		const notes = $store[componentId];
		return notes ? notes.some(Boolean) : false;
	});

export const allNotesVisible = derived(VisibleNotesStore, ($store) =>
	Object.values($store).every((notes) => notes.every(Boolean))
);
