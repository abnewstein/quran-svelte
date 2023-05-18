<script lang="ts">
	export let chapter: Quran.Chapter;
</script>

<div class="title">
	<strong class="text-xl">{chapter.number}</strong>
	<p>
		{chapter.name.arabic} | <small>{chapter.name.transliteration}</small>
	</p>
	<p>{chapter.name.english}</p>
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
