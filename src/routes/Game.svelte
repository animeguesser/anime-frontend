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
			} else if (i + 1 > guesses.length) {
				attempt = 'O';
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

	const onSubmit = async (e) => {
		e.preventDefault();
		let guess = value ? value.split('[')[0] : 'skipped';
		document.getElementById('comboBox').reset();

		let updateIndex = attempts.findIndex((attempt) => {
			return attempt === 'O';
		});

		if (currentGame === 'win') {
			return false;
		}

		if (browser && guess !== metadata?.answer && updateIndex >= 0) {
			attempts[updateIndex] = 'X';
			selected = updateIndex + 2;
			guesses[updateIndex] = guess;
			localStorage.setItem(`day${currentDay}guess${updateIndex}`, guess);
		} else if (guess === metadata?.answer && updateIndex >= 0) {
			localStorage.setItem(`day${currentDay}guess${updateIndex}`, guess);
			localStorage.setItem(`day${currentDay}state`, 'win');
			guesses[updateIndex] = guess;
			currentGame = 'win';
			attempts[updateIndex] = '!';
		}
		return false;
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
				console.log('aniList', aniList);
			}, 650);
		}
	};

	const changeSelected = (value) => {
		selected = Number(value.target.id) + 1;
	};

	const switchImage = (direction) => {
		if (currentGame === 'win' || currentGame === 'failed') {
			if (direction === 'left') {
				if (selected > 1) {
					selected -= 1;
				}
			}
			if (direction === 'right') {
				if (selected < 6) {
					selected += 1;
				}
			}
		} else if (currentGame === 'playing') {
			if (direction === 'left') {
				if (selected > 1) {
					selected -= 1;
				}
			}
			if (direction === 'right') {
				if (selected < 6) {
					if (attempts[selected] === 'X') {
						selected += 1;
					}
				}
			}
		}
	};

	onMount(async () => {
		const metadataRes = await fetch(`https://www.animeguess.moe/days/${currentDay}/metadata.json`, {
			method: 'GET',
			credentials: 'omit', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			}
		});
		if (metadataRes) {
			metadata = await metadataRes.json();
		}
		selected = guesses.length + 1;
	});
</script>

{#if metadata.answer}
	<div class="game">
		<div class="img__container">
			{#if metadata.hints[`0${selected}`]}<div class="img__hints">
					{metadata.hints[`0${selected}`]}
				</div>
			{/if}
			<img class="img" src={`https://www.animeguess.moe/days/${currentDay}/${selected}.jpg`} />
		</div>
		{#if currentGame !== 'win'}
			<div class="game__search">
				<Context>
					<div class="stack">
						<form on:submit={onSubmit} id="comboBox">
							<ComboBox
								label="Anime"
								name="anime"
								placeholder="Search for Anime..."
								on:input={onChange}
								options={aniList.titles
									? aniList.titles.map((title) => ({ text: title, value: title }))
									: null}
								bind:value
							/>
						</form>
					</div>
				</Context>
			</div>
		{:else if currentGame === 'win'}
			<div>You got it!</div>
			<div>The answer was {metadata.answer}</div>
		{:else if currentGame === 'failed'}
			<div>You failed!</div>
			<div>The answer was {metadata.answer}</div>
		{/if}

		<div />
		<div class="game__attempts">
			<button on:click={() => switchImage('left')}> {'<'} </button>
			{#each attempts as attempt, i}
				<button
					id={i}
					disabled={currentGame !== 'win' && currentGame !== 'failed' && attempt === 'O'}
					on:click={changeSelected}
					class={`attempt__${attempt}`}>{i + 1}</button
				>
			{/each}
			<button on:click={() => switchImage('right')}> {'>'} </button>
		</div>
		{#each guesses as guess, i}
			{#if selected === i + 1}
				<div id={i} on:click={changeSelected}>{guess}</div>
			{/if}
		{/each}
	</div>
{:else}
	<div>NOT A VALID DAY</div>
{/if}

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

	.img__hints {
		position: absolute;
		background-color: rgba(168, 166, 166, 0.5);
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
