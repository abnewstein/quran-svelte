<script lang="ts">
	export let onClick: () => void;
	export let active: boolean = false;
	export let title: string = 'Toggle Notes';

	const handleClick = () => {
		active = !active;
		onClick();
	};
</script>

<button on:click={handleClick} class="{active && 'active'} {$$props.class}" {title}>
	<div class="i-ph-notebook-duotone" />
</button>

<style lang="scss">
	button {
		max-width: 1.313rem;
		--uno: no-underline text-current text-xs p-1 bg-white;
		--uno: border-1 border-solid rounded-md border-black;
		&.active {
			--uno: border-blue-500 bg-lightblue-100;
		}
		&:hover,
		&:active {
			--uno: shadow-md shadow-lime-500;
			cursor: pointer;
		}
	}
</style>
