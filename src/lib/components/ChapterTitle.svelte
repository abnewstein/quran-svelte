<script lang="ts">
	export let chapter: Quran.Chapter;
	export let minimal: boolean = false;
</script>

<div flex="~ col items-center" class="title-container">
	<strong>{chapter.number}</strong>
	<p class:minimal>
		{chapter.name.arabic} | <i>{chapter.name.transliteration}</i>
	</p>
	<strong class:minimal>{chapter.name.english}</strong>
</div>

<style lang="scss">
	.title-container {
		strong {
			--uno: prose text-center;
			&:first-child {
				--uno: text-3xl;
			}
			&:last-child {
				--uno: mb-4 text-2xl;
				&.minimal {
					--uno: text-xl;
				}
			}
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
