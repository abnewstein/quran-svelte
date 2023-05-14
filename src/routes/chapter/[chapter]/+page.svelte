<script lang="ts">
	import { quranDataStore, TranslationEnum } from '$lib/QuranData';
	import { get } from 'svelte/store';

	export let data;
	const quranData = get(quranDataStore);
	const chapterData = quranData?.getChapter(Number(data.chapterNumber));
	const verseDataEn = quranData?.getVerses(data.chapterNumber, TranslationEnum.ENGLISH_SAM_GERRANS);
	const verseDataAr = quranData?.getVerses(data.chapterNumber, TranslationEnum.ARABIC_ORIGINAL);
	const combinedData = verseDataAr?.map((verseAr, index) => {
		return {
			...verseAr,
			textEn: verseDataEn ? verseDataEn[index].text : null
		};
	});
</script>

<div class="w-full">
	<div class="grid grid-cols-2 items-baseline gap-4 rounded p-1">
		{#each combinedData as verse}
			<div class="text-right" dir="rtl">
				{verse.text}
			</div>
			<div>
				{verse.textEn}
			</div>
		{/each}
	</div>
</div>

<style>
</style>
