import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import UnoCSS from 'unocss/vite';
import extractorSvelte from '@unocss/extractor-svelte';
import transformerDirectives from '@unocss/transformer-directives';
import { presetAttributify, presetIcons, presetTagify, presetTypography, presetUno } from 'unocss';

export default defineConfig({
	plugins: [
		UnoCSS({
			presets: [
				presetAttributify(),
				presetIcons(),
				presetTagify(),
				presetUno(),
				presetTypography()
			],
			extractors: [extractorSvelte()],
			transformers: [transformerDirectives()],
			mode: 'svelte-scoped'
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
