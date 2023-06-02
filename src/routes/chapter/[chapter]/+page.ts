interface LoadParams {
	chapter: string;
}

export const load = ({ params }: { params: LoadParams }) => {
	return {
		chapterNumber: params.chapter
	};
};