<script lang="ts">
	import { quranDataStore, TranslationEnum } from '$lib/QuranData';
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
	<div class="w-8/9">
		{#if !chapter}
			<div flex="~ flex-col items-center justify-center">
				<span>Loading...</span>
			</div>
		{:else}
			<div class="title">
				<strong class="text-xl">{chapter.number}</strong>
				<p>
					{chapter.name.arabic} | <small>{chapter.name.transliteration}</small>
				</p>
				<p>{chapter.name.english}</p>
			</div>
		{/if}
		<hr />
		<div class="grid grid-cols-2 items-baseline gap-4 rounded p-1">
			{#if chapterNumber !== 1}
				<div class="text-right" dir="rtl">
					{firstVerse?.ar?.text}
				</div>
				<div>
					{firstVerse?.en?.text}
				</div>
			{/if}
			{#if combinedData}
				{#each combinedData as verse, index}
					<div class="text-right" dir="rtl">
						{@html verse.text}
					</div>
					<div>
						<sup class="font-bold mr-1">{index + 1}</sup>
						{@html verse.textEn}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.title {
		@apply flex flex-col items-center text-center;
		p {
			@apply prose-stone mb-2 mt-0;
			&:last-of-type {
				@apply font-bold mb-3;
			}
			small {
				@apply font-italic;
			}
		}
	}
</style>
