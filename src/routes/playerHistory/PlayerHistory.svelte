<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let currentDay;

	$: history = [];
	$: selected = 1;

	const getAttempts = async (game, guesses) => {
		let attempts = [];
		for (let i = 0; i < 5; i++) {
			let attempt = 'O';
			if (game === 'win') {
				if (i + 1 === guesses.length) {
					attempt = '!';
					selected = i + 1;
				} else if (i + 1 > guesses.length) {
					attempt = 'O';
				} else {
					attempt = 'X';
				}
			} else if ((game === 'playing' || game === 'failed') && guesses[i]) {
				if (guesses[i].length > 0) {
					attempt = 'X';
				}
			} else if (game === 'unplayed') {
				attempt = '?';
			}
			if (attempt === 'O' && selected === 1) {
				selected = i + 1;
			}
			attempts.push(attempt);
		}
		return attempts;
	};

	const getGuesses = async (day) => {
		let tempArr = [];
		for (let i = 0; i < 5; i++) {
			let guess = localStorage.getItem(`day${day}guess${i}`);

			if (guess) {
				tempArr.push(guess);
			}
			console.log(guess);
		}
		console.log('tempArr', tempArr);
		return tempArr;
	};

	onMount(async () => {
		console.log('history', history);
		if (browser) {
			for (let i = 1; i < currentDay + 1; i++) {
				let guesses = [];
				let attempts = [];
				let state = 'unplayed';
				let localState = await localStorage.getItem(`day${i}state`);
				if (localState) {
					state = localState;
				}
				guesses = await getGuesses(i);
				attempts = await getAttempts(state, guesses);
				console.log(guesses, attempts);

				history[i - 1] = { attempts, state };
			}
		}
		console.log(history);
	});
</script>

<div class="history">
	{#each history as game, i}
		<div class="history__row">
			<a class="history__link" href={`/?day${i + 1}`}>Play Day #{i + 1} </a>
			<div id={i}>{game.state}</div>
			{#each game.attempts as attempt, i}
				<div id={i}>{attempt}</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.history {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 1rem 0;
	}

	.history__row {
		display: flex;
		flex-direction: row;
		margin: 1rem;
	}

	.history__link {
		margin-right: 0.5rem;
	}

	.history-viewport {
		width: 50rem;
		height: 20rem;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.history-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--color-theme-1);
		font-size: 4rem;
		align-items: center;
		justify-content: center;
	}

	.history-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.img {
		height: 100%;
		width: 100%;
	}
	.img__container {
		max-width: 30rem;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
