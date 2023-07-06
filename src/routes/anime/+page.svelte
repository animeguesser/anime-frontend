<script>
	import Clock from './Clock.svelte';
	import Game from './Game.svelte';
	import animeJson from '$lib/json/parsed-anime-list-mini.json';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import playerHistory from '$lib/shared/stores/playerHistory';

	let timeUntil = 0;
	let currentDay = 0;
	let attempts = ['O', 'O', 'O', 'O', 'O', 'O'];
	let images = [];

	onMount(async () => {
		const res = await fetch('http://0.0.0.0:8000/time');
		const time = await res.json();
		timeUntil = await time.timeUntil;
		currentDay = await time.currentDay;
		console.log(JSON.parse($playerHistory)[currentDay]);
		let currentAttempt = JSON.parse($playerHistory)[currentDay];
		attempts = currentAttempt ? currentAttempt : ['O', 'O', 'O', 'O', 'O', 'O'];
	});
</script>

`
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Clock {timeUntil} />
	<Game {attempts} {images} {currentDay} />
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
