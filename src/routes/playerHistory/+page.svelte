<script>
	import Clock from './Clock.svelte';
	import PlayerHistory from './PlayerHistory.svelte';
	import { onMount } from 'svelte';

	let timeUntil = 0;
	let currentDay = 0;
	onMount(async () => {
		// haitus
		/*const res = await fetch('https://api.animeguess.moe/time');
		const time = await res.json();*/
		const time = {"currentDay": 365, "timeUntil": 999999999999999999};
		timeUntil = await time.timeUntil;
		currentDay = await time.currentDay;
	});
</script>

<svelte:head>
	<title>History</title>
</svelte:head>

<section>
	{#if currentDay > 0}
		<PlayerHistory {currentDay} />
	{/if}
	<!--hiatus <Clock {timeUntil} />-->
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
