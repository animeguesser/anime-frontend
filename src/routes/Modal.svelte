<script>
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

	export let showModal; // boolean

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<button class="exit" autofocus on:click={() => dialog.close()}
			><Fa icon={faTimesCircle} /></button
		>
		<slot name="header" />
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
	</div>
</dialog>

<style>
	dialog {
		max-width: 30rem;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		background-color: var(--color-theme-2);
		color: white;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.exit {
		position: absolute;
		background: none;
		right: 20px;
		color: white;
		border: none;
		outline: none;
	}
</style>
