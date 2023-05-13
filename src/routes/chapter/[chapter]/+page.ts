import type { PageLoad } from './$types';

export const load = (({ params }) => {
	return {
		chapterNumber: params.chapter
	};
}) satisfies PageLoad;
