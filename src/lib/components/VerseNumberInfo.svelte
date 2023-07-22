<script lang="ts" context="module">
	export type displayType = 'none' | 'verse' | 'chapter:verse';
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { keyToString } from '$lib/utils/VerseKeyUtils.js';

	export let reference: QuranRef.Reference;
	export let display: displayType = 'none';

	const referenceKey = reference as QuranRef.Verse;
	const gotoReference = () => {
		switch (reference.type) {
			case 'chapter':
				break;
			case 'verse':
				goto(`/chapter/${reference.chapterNumber}?verse=${reference.verseNumber}`);
				break;
			case 'range':
				goto(
					`/chapter/${reference.chapterNumber}?verse=${reference.verseStart}-${reference.verseEnd}`
				);
				break;
			case 'note':
				break;
		}
	};
</script>

{#if display !== 'none'}
	{#if display === 'verse'}
		<sup class="font-bold mr-1">{referenceKey.verseNumber}</sup>
	{:else if display === 'chapter:verse'}
		<button on:click={gotoReference}>
			<sup class="font-bold mr-1 text-xl">{keyToString(referenceKey)}</sup>
		</button>
	{/if}
{/if}

<style lang="scss">
	button {
		--uno: bg-transparent border-none p-0 cursor-pointer color-blue-700;
		&:hover {
			text-decoration: underline;
		}
	}
</style>
