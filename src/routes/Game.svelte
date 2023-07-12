<script lang="ts">
	// import svelte combobox and Context
	import Context from './Context.svelte';
	import ComboBox from './ComboBox.svelte';

	// import lifecyle and browser to safely use local state
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// import fontawesome icons neccessary
	import Fa from 'svelte-fa/src/fa.svelte';
	import {
		faChevronLeft,
		faChevronRight,
		faTimes,
		faCheck
	} from '@fortawesome/free-solid-svg-icons';

	// export to get Props passed in from Game component
	export let state;
	export let guesses: string | any[] = [];
	export let currentDay = 0;

	// instatiate variables for game management
	let value = '';
	let currentGame = state;
	let timeoutIdForSearch: number | null | undefined = null;
	let attempts: any[] = [];

	// reactivity variables
	$: aniList = [];
	$: selected = 1;
	$: metadata = { answer: undefined };
	$: expand = false;

	// create the atempts and selected default state should maybe be in mount
	for (let i = 0; i < 6; i++) {
		let attempt = 'O';
		if (currentGame === 'win') {
			if (i + 1 === guesses.length) {
				attempt = 'W';
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

	// onSubmit function for form submition
	const onSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		// split off and maintain the  non synonym response
		let guess = value ? value.split('[')[0] : 'skipped';

		// identify the next valid index that can change state
		let updateIndex = attempts.findIndex((attempt) => {
			return attempt === 'O';
		});

		// should not be submitable if the game is over
		if (currentGame === 'win' || currentGame === 'failed') {
			return false;
		}

		// if the browser is ready for local storage updates and we have an available answer. Validates the value and updates game and local storage

		if (browser && guess.trim() !== metadata?.answer && updateIndex >= 0) {
			attempts[updateIndex] = 'X';
			selected = updateIndex + 2;
			guesses[updateIndex] = guess;
			localStorage.setItem(`day${currentDay}guess${updateIndex}`, guess);
			if (updateIndex === 5) {
				localStorage.setItem(`day${currentDay}state`, 'failed');
				attempts[updateIndex] = 'X';
				currentGame = 'failed';
				selected = 6;
			}
		} else if (guess.trim() === metadata?.answer.trim() && updateIndex >= 0) {
			localStorage.setItem(`day${currentDay}guess${updateIndex}`, guess);
			localStorage.setItem(`day${currentDay}state`, 'win');
			guesses[updateIndex] = guess;
			currentGame = 'win';
			attempts[updateIndex] = 'W';
		}
		value = '';
		// reset the combo box when submitted
		document.getElementById('comboBox').reset();
		return false;
	};

	// function to handle changes within the combobox and pull from the search api
	const onChange = async (e: { target: { value: any } }) => {
		let search = e.target.value;

		// begin the search after atleast 3 characters have been entered
		if (search.length > 2) {
			expand = true;

			//valudate that a search may take place based off of timer
			if (timeoutIdForSearch !== null) {
				clearTimeout(timeoutIdForSearch);
			}

			// execute the search with the timeout in mind and set it's value
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
			}, 650);
		}
	};

	// function to change the value to selected button
	const changeSelected = (value: { target: { id: string } }) => {
		selected = Number(value.target.id) + 1;
		document.getElementById('comboBox').reset();
	};

	// function to switch the selected image from the gallery buttons
	const switchImage = (direction: string) => {
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
					if (attempts[selected - 1] === 'X') {
						selected += 1;
					}
				}
			}
		}
	};

	// function to copy the game results into your clipboard
	const copy = () => {
		navigator.clipboard.writeText(
			`${currentGame} on day ${currentDay}. \n${attempts.map((attempt) => `${attempt} `)}`
		);
	};

	// lifecylce function to setup for the state of the game
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
		<div class="game__attempts">
			{#each attempts as attempt, i}
				<button
					id={`${i}`}
					disabled={currentGame !== 'win' && currentGame !== 'failed' && attempts[i - 1] === 'O'}
					on:click={changeSelected}
					class={`attempt__${attempt} ${i + 1 === selected ? 'highlight' : ''}`}>{i + 1}</button
				>
			{/each}
		</div>
		<div class="img__container">
			<div class="gallery__day">Day {currentDay}</div>

			{#if metadata.hints[`0${selected}`]}
				<strong class="img__hints">
					{metadata.hints[`0${selected}`]}
				</strong>
			{/if}
			<div class="gallery">
				<button
					disabled={selected === 1}
					on:click={() => switchImage('left')}
					class="gallery__button"
				>
					<Fa icon={faChevronLeft} />
				</button>

				<img class="img" src={`https://www.animeguess.moe/days/${currentDay}/${selected}.jpg`} />
				<button
					disabled={selected === 6}
					on:click={() => switchImage('right')}
					class="gallery__button"
				>
					<Fa icon={faChevronRight} />
				</button>
			</div>
		</div>
		{#if currentGame === 'playing'}
			<Context>
				<div>
					<form
						on:keydown={(event) => event.key !== 'Enter'}
						on:submit={onSubmit}
						id="comboBox"
						class="game__search"
					>
						<button type="submit" disabled style="display: none" aria-hidden="true" />
						<div class="game__comboBox">
							<ComboBox
								name="anime"
								placeholder="Search for Anime..."
								on:input={onChange}
								options={aniList.titles
									? aniList.titles.map((title) => ({ text: title, value: title }))
									: null}
								bind:value
							/>
							{#if value === ''}
								<button class="skip__button" on:submit={onSubmit}>skip</button>
							{/if}
						</div>
						<button class="submit__button" type="submit">Submit</button>
					</form>
				</div>
			</Context>
		{:else if currentGame === 'win'}
			<div class="game__result">You got it!</div>
			<div class="game__title">The answer was {metadata.answer}</div>
			<button on:click={() => copy()}>Copy Result</button>
		{:else if currentGame === 'failed'}
			<div class="game__result">You failed!</div>
			<div class="game__title">The answer was {metadata.answer}</div>
			<button class="copy__button" on:click={() => copy()}>Copy Result</button>
		{/if}

		<div />

		<div class="guesses">
			{#each guesses as guess, i}
				<div class="guesses__row">
					<div class={`guess__${attempts[i]}`}>
						<Fa icon={attempts[i] === 'X' ? faTimes : faCheck} />
					</div>
					<div class="guess__text" id={`${i}`} on:click={changeSelected}>{guess}</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.game {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 1rem 0;
		width: 50vw;
		height: fit-content;
	}

	.game__search {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: text;
		height: 7rem;
		width: 18rem;
	}
	.game__comboBox {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: text;
		width: 100%;
	}

	.game__result {
		font-size: 1.2rem;
		font-weight: 300;
		font-style: italic;
		color: white;
	}

	.game__title {
		font-size: 1rem;
		font-style: italic;
		color: white;
	}

	.game-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.skip__button {
		height: 100%;
		margin-left: 5px;
		border-radius: 5px;
		border: none;
		width: 4rem;
		background-color: var(--color-theme-2);
	}
	.submit__button {
		height: 3rem;
		border-radius: 5px;
		border: none;
		margin-top: 5px;
		width: 100%;
		background-color: var(--color-correct);
	}

	.copy__button {
		height: 2rem;
		border-radius: 5px;
		border: none;
		margin-top: 5px;
		width: 20rem;
		background-color: var(--color-correct);
	}

	.attempt__X {
		background-color: var(--color-wrong);
		color: white;
		font-size: 1.2rem;
		height: 40px;
		width: 25px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}

	.attempt__W {
		background-color: var(--color-correct);
		color: white;
		font-size: 1.2rem;
		height: 40px;
		width: 25px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}

	.attempt__O {
		background-color: var(--color-theme-2);
		color: white;
		font-size: 1.2rem;
		height: 40px;
		width: 25px;
		margin: 2px;
		border: none;
		border-radius: 5px;
	}

	.highlight {
		text-decoration: underline;
	}
	.guess__X {
		color: var(--color-wrong);
		font-size: 2rem;
	}

	.guess__W {
		color: var(--color-correct);
		font-size: 2rem;
	}

	.guess__text {
		color: var(--color-theme-2);
		font-size: 1.2rem;
		margin-left: 10px;
	}

	.guesses {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
		text-align: left;
	}

	.guesses__row {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.gallery {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.gallery__button {
		background-color: var(--color-theme-2);
		border-radius: 5px;
		height: 125px;
		font-size: 2rem;
		margin: 0px 10px 0px 10px;
	}

	.gallery__day {
		text-align: right;
		color: white;
		font-size: 0.8rem;
		margin-bottom: 2px;
	}

	.img {
		height: 100%;
		width: 100%;
	}
	.img__container {
		max-width: 30rem;
		margin-bottom: 30px;
	}

	.img__hints {
		position: absolute;
		background-color: rgba(168, 166, 166, 0.65);
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
