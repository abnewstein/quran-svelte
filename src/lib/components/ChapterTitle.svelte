<script lang="ts">
	export let chapter: Quran.Chapter;
	export let minimal: boolean = false;
</script>

<div class="title-container">
	<strong class="text-3xl">{chapter.number}</strong>
	<p class:minimal>
		{chapter.name.arabic} <span>|</span>
		{chapter.name.transliteration}
	</p>
	<strong class="mb-4 text-2xl" class:text-xl={minimal}>{chapter.name.english}</strong>
</div>

<style lang="scss">
	.title-container {
		--uno: flex flex-col items-center;
		strong {
			--uno: text-center font-bold;
		}
		p {
			--uno: text-stone-600 my-2 text-center text-2xl;
			&.minimal {
				--uno: text-xl;
			}
			span {
				--uno: text-stone-300;
			}
		}
	}
</style>
