export const prerender = true;

export function load({ url }) {
	const { pathname } = url;

	return {
		pathname
	};
}
