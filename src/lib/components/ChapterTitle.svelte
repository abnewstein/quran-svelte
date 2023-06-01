<script lang="ts">
	export let chapter: Quran.Chapter;
	export let minimal: boolean = false;
</script>

<div flex="~ col items-center" class:text-xl={minimal}>
	<strong class="text-3xl">{chapter.number}</strong>
	<p class:text-2xl={!minimal}>
		{chapter.name.arabic} | <i>{chapter.name.transliteration}</i>
	</p>
	<strong class="mb-4" class:text-2xl={!minimal}>{chapter.name.english}</strong>
</div>

<style lang="scss">
	p {
		--uno: prose prose-stone my-2 text-center;
	}

	strong {
		--uno: prose text-center;
	}
</style>
