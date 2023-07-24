<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let currentDay;

	$: history = [];
	$: selected = 1;

	const onSelectDay = (e) => {
		window.location.href = `/?day${e.target.id}`;
	};

	const selectRandomDay = () => {
		const randomList = history.filter((game, i) => {
			return game.state === 'unplayed' || game.state === 'playing';
		});
		const randomDay = randomList[Math.floor(Math.random() * randomList.length)].day;
		window.location.href = `/?day${randomDay}`;
	};

	onMount(async () => {
		console.log('history', history);
		if (browser) {
			for (let i = currentDay; i > 0; i--) {
				let state = 'unplayed';
				console.log(i, 'i');
				let localState = await localStorage.getItem(`puzzle${i}state`);
				if (localState) {
					state = localState;
				}

				history[currentDay - i] = { state, day: i };
			}
		}
	});
</script>

<div class="header">Archive</div>
<div class="subheader">
	<button id={currentDay} class="subheader__button" on:click={onSelectDay}>Current Day</button>
	<button on:click={selectRandomDay} class="subheader__button">Random Day</button>
</div>
<div class="history">
	{#each history as game, i}
		<div class="history__item">
			<button id={`${currentDay - i}`} on:click={onSelectDay} class={`state__${game?.state}`}
				>{currentDay - i}</button
			>
		</div>
	{/each}
</div>

<style>
	.header {
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 5px;
	}
	.subheader {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		width: 35vw;
		margin-bottom: 5px;
	}
	.subheader__button {
		background-color: var(--color-theme-2);
		color: white;
		font-size: 1.2rem;
		height: 70px;
		width: 100%;
		margin: 2px;
		border: none;
		border-radius: 5px;
		margin: 5px;
	}
	.history {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
		width: 35vw;
	}

	.state__failed {
		background-color: var(--color-wrong);
		color: white;
		font-size: 1.2rem;
		height: 70px;
		width: 70px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}

	.state__win {
		background-color: var(--color-correct);
		color: white;
		font-size: 1.2rem;
		height: 70px;
		width: 70px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}

	.state__playing {
		background-color: var(--color-theme-2);
		color: white;
		font-size: 1.2rem;
		height: 70px;
		width: 70px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}
	.state__unplayed {
		background-color: #474747;
		color: white;
		font-size: 1.2rem;
		height: 70px;
		width: 70px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}

	@media (max-width: 500px) {
		.history {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			align-items: center;
			flex-direction: row;
			width: 90vw;
		}
	}

	.history__row {
		display: flex;
		flex-direction: row;
		margin: 1rem;
	}

	.history__link {
		margin-right: 0.5rem;
	}
</style>
