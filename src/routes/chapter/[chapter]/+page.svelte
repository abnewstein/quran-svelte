<script lang="ts">
	import { quranDataStore } from '$lib/store';
	import ChapterTitle from '$lib/components/ChapterTitle.svelte';

	export let data;
	const chapterNumber = Number(data.chapterNumber);
	$: chapter = quranDataStore.getChapter;
	$: verseDataEn = quranDataStore.getVersesEn;
	$: verseDataAr = quranDataStore.getVersesAr;
	$: firstVerse = quranDataStore.firstVersePair;
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<div class="flex flex-col items-center py-2 md:py-10">
	<container class="w-8/9">
		{#if chapter}
			<ChapterTitle chapter={$chapter(chapterNumber)} />
		{/if}
		<hr />
		<div class="verses-grid">
			{#if chapterNumber !== 1}
				<p class="ar-text" dir="rtl">
					{$firstVerse?.ar?.text}
				</p>
				<p class="en-text">
					{@html $firstVerse?.en?.text}
				</p>
			{/if}
			{#each $verseDataAr(chapterNumber) as verse, index}
				{@const verseTextEn = $verseDataEn(chapterNumber)[index].text}
				<p class="ar-text" dir="rtl">
					{@html verse.text}
				</p>
				<p class="en-text">
					<sup class="font-bold mr-1">{index + 1}</sup>
					{@html verseTextEn}
				</p>
			{/each}
		</div>
	</container>
</div>

<style lang="scss">
	.verses-grid {
		--uno: grid items-baseline gap-4 rounded p-1;
		grid-template-columns: 9fr 11fr;
		@screen lt-sm {
			grid-template-columns: 2fr 3fr;
		}
	}
	p {
		--uno: prose my-0;

		&.ar-text {
			--uno: text-right text-2xl;
		}

		&.en-text {
			--uno: text-xl;
		}
	}
</style>
