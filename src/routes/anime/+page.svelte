<script>
	import Clock from './Clock.svelte';
	import Game from './Game.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let timeUntil = 0;
	let currentDay = 0;
	$: state = undefined;
	$: guesses = undefined;
	let images = [];

	onMount(async () => {
		const res = await fetch('https://api.animeguess.moe/time');
		const time = await res.json();
		timeUntil = await time.timeUntil;
		currentDay = await time.currentDay;
		if (browser) {
			guesses = [];
			state = 'playing';
			let localState = localStorage.getItem(`day${currentDay}state`);
			if (localState) {
				state = localState;
			} else {
				localStorage.setItem(`day${currentDay}state`, state);
			}
			let tempArr = [];
			for (let i = 0; i < 5; i++) {
				let guess = localStorage.getItem(`day${currentDay}guess${i}`);

				if (guess) {
					tempArr.push(guess);
				}
			}
			guesses = tempArr;
		}
	});
</script>

`
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if guesses && state}
		<Game {state} {guesses} {images} {currentDay} />
	{/if}
	<Clock {timeUntil} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
