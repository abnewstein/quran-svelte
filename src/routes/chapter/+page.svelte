<script lang="ts">
	import { quranDataStore } from '$lib/QuranData';
	import { get } from 'svelte/store';

	const quranData = get(quranDataStore);
	const chapters = quranData?.getChapters();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
	{#each chapters as chapter}
		<div class="rounded-2xl p-1 shadow-xl">
			<a class="block rounded-xl bg-white p-4 sm:p-6 lg:p-8" href="/chapter/{chapter.number}">
				<h2 class="card-title flex flex-col items-center text-center">
					<strong class="text-xl">{chapter.number}</strong>
					<span class="mt-1 text-slate-600">
						{chapter.name.arabic}
						{'|'}
						<small class="italic">{chapter.name.transliteration}</small>
					</span>
					<span class="mt-1">{chapter.name.english}</span>
				</h2>
			</a>
		</div>
	{/each}
</div>

<style>
</style>
