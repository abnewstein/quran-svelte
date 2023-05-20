<script lang="ts">
	export let chapter: Quran.Chapter;
</script>

<div flex="~ col items-center text-center">
	<strong class="text-2xl">{chapter.number}</strong>
	<p class="text-lg">
		{chapter.name.arabic} | <small>{chapter.name.transliteration}</small>
	</p>
	<p>{chapter.name.english}</p>
</div>

<style lang="scss">
	p {
		--uno: prose prose-stone mb-2 mt-0 text-center;
		&:last-of-type {
			--uno: font-bold mb-3;
		}
		small {
			--uno: font-italic text-sm;
		}
	}
</style>
