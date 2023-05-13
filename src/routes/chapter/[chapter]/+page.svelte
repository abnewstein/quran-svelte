<script lang="ts">
	import { quranDataStore, TranslationEnum } from '$lib/QuranData';
	import { get } from 'svelte/store';

	export let data;
	const quranData = get(quranDataStore);
	const chapterData = quranData?.getChapter(Number(data.chapterNumber));
	const verseDataEn = quranData?.getVerses(data.chapterNumber, TranslationEnum.ENGLISH_SAM_GERRANS);
	const verseDataAr = quranData?.getVerses(data.chapterNumber, TranslationEnum.ARABIC_ORIGINAL);
</script>

<div class="w-full">
	{#each verseDataAr as verse}
		<div key={verse.id} class="grid grid-cols-2 items-baseline gap-4 rounded p-1" />
	{/each}
</div>

<style>
</style>
