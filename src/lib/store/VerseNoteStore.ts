import { writable } from 'svelte/store';

export const activeVerseNotes = writable(new Set<Quran.VerseNoteKey>());