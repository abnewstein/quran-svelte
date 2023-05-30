// uno.config.ts
import {
	defineConfig,
	presetIcons,
	presetAttributify,
	presetTypography,
	presetUno,
	presetTagify
} from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	presets: [presetUno(), presetAttributify(), presetIcons(), presetTagify(), presetTypography()],
	extractors: [extractorSvelte()],
	transformers: [transformerDirectives()]
});
