<script lang="ts">
	import ChapterTitle from './ChapterTitle.svelte';
	export let chapter: Quran.Chapter;
</script>

<a border="solid 1 black rounded-xl" href="/chapter/{chapter.number}">
	<ChapterTitle {chapter} minimal />
	<span class="verse-count text-xs prose-stone" border="solid 1 black rounded-lg" p="y-1 x-2"
		>{chapter.versesCount} verses</span
	>
</a>

<style lang="scss">
	a {
		--uno: block relative p-4 pb-6;
		--uno: bg-white no-underline text-current;
		&:hover {
			--uno: shadow-md shadow-lime-500;
		}
		.verse-count {
			--uno: bottom-1 absolute right-1 left-1 m-a;
			width: fit-content;
		}
	}
</style>
