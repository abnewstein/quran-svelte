<script lang="ts">
	export let chapter: Quran.Chapter;
</script>

<div flex="~ col items-center text-center">
	<strong class="text-3xl">{chapter.number}</strong>
	<p>
		{chapter.name.arabic} | <i>{chapter.name.transliteration}</i>
	</p>
	<p class="font-bold mb-3">{chapter.name.english}</p>
</div>

<style lang="scss">
	p {
		--uno: prose prose-stone mb-2 mt-0 text-center text-lg;
	}
</style>
