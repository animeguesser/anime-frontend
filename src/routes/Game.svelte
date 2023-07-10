<script lang="ts">
	import { browser } from '$app/environment';
	import Context from './Context.svelte';
	import ComboBox from './ComboBox.svelte';
	import { onMount } from 'svelte';

	export let state;
	export let guesses;
	export let currentDay;

	let value = '';

	let currentGame = state;
	let attempts = [];
	$: aniList = [];
	$: selected = 1;
	$: metadata = {};
	let timeoutIdForSearch = null;

	for (let i = 0; i < 5; i++) {
		let attempt = 'O';
		if (currentGame === 'win') {
			if (i + 1 === guesses.length) {
				attempt = '!';
				selected = i + 1;
			} else {
				attempt = 'X';
			}
		} else if ((currentGame === 'playing' || currentGame === 'failed') && guesses[i]) {
			if (guesses[i].length > 0) {
				attempt = 'X';
			}
		}
		if (attempt === 'O' && selected === 1) {
			selected = i + 1;
		}
		attempts.push(attempt);
	}

	const onSubmit = async () => {
		let guess = value ? value : 'skipped';

		console.log(guess, metadata?.answer);

		let updateIndex = attempts.findIndex((attempt) => {
			return attempt === 'O';
		});
		if (browser && guess !== metadata?.answer && updateIndex >= 0) {
			attempts[updateIndex] = 'X';
			localStorage.setItem(`day${currentDay}guess${updateIndex}`, guess);
		} else if (guess === metadata?.answer && updateIndex > 0) {
			localStorage.setItem(`day${currentDay}guess${updateIndex}`, guess);
			localStorage.setItem(`day${currentDay}state`, 'win');
			attempts[updateIndex] = '!';
		}
	};

	const onChange = async (e) => {
		let search = e.target.value;
		if (search.length > 2) {
			if (timeoutIdForSearch !== null) {
				clearTimeout(timeoutIdForSearch);
			}
			timeoutIdForSearch = setTimeout(async function () {
				const res = await fetch('https://api.animeguess.moe/search', {
					method: 'POST',
					credentials: 'omit', // include, *same-origin, omit
					headers: {
						'Content-Type': 'application/json'
						// 'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: JSON.stringify({ query: search })
				});
				aniList = await res.json();
			}, 350);
		}
	};

	const changeSelected = (value) => {
		selected = Number(value.target.id) + 1;
		console.log('selected', selected);
	};

	onMount(async () => {
		const res = await fetch('http://localhost:8000/search', {
			method: 'POST',
			credentials: 'omit', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({ query: '' })
		});
		const metadataRes = await fetch('https://www.animeguess.moe/days/6/metadata.json', {
			method: 'GET',
			credentials: 'omit', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			}
		});
		metadata = await metadataRes.json();
		aniList = await res.json();
	});
</script>

<div class="game">
	<div class="img__container">
		<img class="img" src={`https://www.animeguess.moe/days/${currentDay}/${selected}.jpg`} />
	</div>
	<div class="game__search">
		<Context>
			<div class="stack">
				<form on:submit={onSubmit}>
					<ComboBox
						label="Anime"
						name="anime"
						placeholder="Search for Anime..."
						on:input={onChange}
						options={aniList.titles
							? aniList.titles.map((title) => ({ text: title, value: title.toLowerCase() }))
							: null}
						bind:value
					/>
				</form>
			</div>
		</Context>
	</div>
	<div />
	<div class="game__attempts">
		{attempts}
	</div>
	{#each guesses as guess, i}
		<div id={i} on:click={changeSelected}>{guess}</div>
	{/each}
</div>

<style>
	.game {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 1rem 0;
	}

	.game__search {
	}

	.game-viewport {
		width: 50rem;
		height: 20rem;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.game-viewport strong {
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

	.game-digits {
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
