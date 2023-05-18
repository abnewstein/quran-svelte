// uno.config.ts
import { defineConfig, presetIcons, presetAttributify, presetTypography, presetUno } from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	presets: [presetUno(), presetAttributify(), presetIcons(), presetTypography()],
	extractors: [extractorSvelte()],
	transformers: [transformerDirectives()]
});
