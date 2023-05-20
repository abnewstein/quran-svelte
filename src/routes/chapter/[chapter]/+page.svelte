<script lang="ts">
	import { quranDataStore, TranslationEnum } from '$lib/QuranData';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';
	import { get } from 'svelte/store';

	export let data;
	const chapterNumber = Number(data.chapterNumber);
	const quranData = get(quranDataStore);
	const chapter = quranData?.getChapter(chapterNumber);
	const verseDataEn = quranData?.getVerses(chapterNumber, TranslationEnum.ENGLISH_SAM_GERRANS);
	const verseDataAr = quranData?.getVerses(chapterNumber, TranslationEnum.ARABIC_ORIGINAL);
	const combinedData = verseDataAr?.map((verseAr, index) => {
		return {
			...verseAr,
			textEn: verseDataEn ? verseDataEn[index].text : null
		};
	});
	const firstVerse = quranData?.getFirstVersePair();
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		{#if chapter}
			<ChapterTitle {chapter} />
		{/if}
		<hr />
		<div grid="~ cols-2 items-baseline gap-4 rounded p-1">
			{#if chapterNumber !== 1}
				<div class="ar-text" dir="rtl">
					{firstVerse?.ar?.text}
				</div>
				<div>
					{firstVerse?.en?.text}
				</div>
			{/if}
			{#if combinedData}
				{#each combinedData as verse, index}
					<div class="ar-text" dir="rtl">
						{@html verse.text}
					</div>
					<div>
						<sup class="font-bold mr-1">{index + 1}</sup>
						{@html verse.textEn}
					</div>
				{/each}
			{/if}
		</div>
	</container>
</div>

<style>
	.ar-text {
		--uno: text-right text-xl;
	}
</style>
