<script lang="ts">
	import { quranDataStore, TranslationEnum } from '$lib/QuranData';
	import { get } from 'svelte/store';

	export let data;
	const chapterNumber = Number(data.chapterNumber);
	const quranData = get(quranDataStore);
	const chapterData = quranData?.getChapter(chapterNumber);
	const verseDataEn = quranData?.getVerses(chapterNumber, TranslationEnum.ENGLISH_SAM_GERRANS);
	const verseDataAr = quranData?.getVerses(chapterNumber, TranslationEnum.ARABIC_ORIGINAL);
	const combinedData = verseDataAr?.map((verseAr, index) => {
		return {
			...verseAr,
			textEn: verseDataEn ? verseDataEn[index].text : null
		};
	});
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="w-full">
	<div class="grid grid-cols-2 items-baseline gap-4 rounded p-1">
		{#if combinedData}
			{#each combinedData as verse}
				<div class="text-right" dir="rtl">
					{@html verse.text}
				</div>
				<div>
					{@html verse.textEn}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
</style>
