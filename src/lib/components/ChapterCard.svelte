<script lang="ts">
	import ChapterTitle from './ChapterTitle.svelte';
	export let chapter: Quran.Chapter;
</script>

<a href="/chapter/{chapter.number}">
	<ChapterTitle {chapter} minimal />
	<span class="verse-count">{chapter.versesCount} verses</span>
</a>

<style lang="scss">
	a {
		--uno: block relative p-4 pb-6;
		--uno: bg-white no-underline text-current;
		--uno: border-solid border-1 border-black rounded-xl;
		&:hover {
			--uno: shadow-md shadow-lime-500;
		}
		.verse-count {
			--uno: bottom-1 absolute right-1 left-1 m-a;
			--uno: border-1 border-solid border-black rounded-lg;
			--uno: text-xs prose-stone p-y-1 p-x-2;
			width: fit-content;
		}
	}
</style>
