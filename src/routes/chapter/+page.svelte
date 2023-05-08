<script lang="ts">
	import { quranDataStore } from '$lib/QuranData';
	import { get } from 'svelte/store';

	const quranData = get(quranDataStore);
	const chapters = quranData?.getChapters();
</script>

<div class="grid grid-cols-6 gap-2">
	{#each chapters as chapter}
		<div class="rounded-2xl p-1 shadow-xl">
			<a class="block rounded-xl bg-white p-4 sm:p-6 lg:p-8" href="/chapter/{chapter.number}">
				<h2 class="card-title flex flex-col">
					<strong>{chapter.number}</strong>
					<span>
						{chapter.name.arabic}
						{'|'}
						<small class="italic text-muted">{chapter.name.transliteration}</small>
					</span>
					{chapter.name.english}
				</h2>
			</a>
		</div>
	{/each}
</div>

<style>
</style>
