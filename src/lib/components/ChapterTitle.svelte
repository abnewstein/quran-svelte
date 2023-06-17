<script lang="ts">
	export let chapter: Quran.Chapter;
	export let minimal: boolean = false;
</script>

<div flex="~ col items-center" class="title-container">
	<strong text-3xl>{chapter.number}</strong>
	<p class:minimal>
		{chapter.name.arabic} | <i>{chapter.name.transliteration}</i>
	</p>
	<strong mb-4 text-2xl class:text-xl={minimal}>{chapter.name.english}</strong>
</div>

<style lang="scss">
	.title-container {
		strong {
			--uno: prose text-center;
		}
		p {
			--uno: prose prose-slate my-2 text-center text-2xl font-bold;
			i {
				--uno: text-xl;
			}
			&.minimal {
				--uno: text-xl;
				i {
					--uno: text-lg;
				}
			}
		}
	}
</style>
