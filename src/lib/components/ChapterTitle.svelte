<script lang="ts">
	export let chapter: Quran.Chapter;
</script>

<div flex="~ col items-center text-center">
	<strong class="text-3xl">{chapter.number}</strong>
	<p>
		{chapter.name.arabic} | <i>{chapter.name.transliteration}</i>
	</p>
	<strong class="text-2xl mb-3">{chapter.name.english}</strong>
</div>

<style lang="scss">
	p {
		--uno: prose prose-stone mb-3 mt-0 text-center text-2xl;
	}
</style>
