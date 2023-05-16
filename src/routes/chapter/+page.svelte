<script lang="ts">
	import { quranDataStore } from '$lib/QuranData';
	import { get } from 'svelte/store';

	const quranData = get(quranDataStore);
	const chapters = quranData?.getChapters();
</script>

<div class="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
	{#each chapters as chapter}
		<div
			class="relative rounded-xl bg-white p-4 sm:p-6 lg:p-8 border-[0.0314rem] border-black shadow-md"
		>
			<a class="block" href="/chapter/{chapter.number}">
				<div class="flex flex-col items-center text-center mb-3">
					<strong class="text-xl">{chapter.number}</strong>
					<span class="mt-1 text-slate-600">
						{chapter.name.arabic}
						{'|'}
						<small class="italic">{chapter.name.transliteration}</small>
					</span>
					<span class="mt-1">{chapter.name.english}</span>
					<span
						class="bottom-2 text-xs absolute prose prose-sm prose-stone border-black border-[0.0314rem] rounded-lg py-1 px-2"
						>{chapter.versesCount} verses</span
					>
				</div>
			</a>
		</div>
	{/each}
</div>

<style>
</style>
