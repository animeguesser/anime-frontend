<script>
	// import main elements
	import Clock from './Clock.svelte';
	import Game from './Game.svelte';

	// import lifecyle and browser to safely use local state
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// import to get page search params
	import { page } from '$app/stores';

	// import fontAwesome
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

	// instantiate  variables
	let timeUntil = 0;
	let selectedDay = 0;
	let currentDay = 0;
	$: state = '';
	let leftDisabled = false;
	let rightDisabled = false;

	/**
	 * @type {string[]}
	 */
	$: guesses = [];

	// function to switch the day from the clock
	const moveDay = (/** @type {string} */ direction) => {
		if (direction === 'left' && selectedDay - 1 > 0)
			window.location.href = `/?day${selectedDay - 1}`;
		else if (direction === 'right' && selectedDay !== currentDay)
			window.location.href = `/?day${selectedDay + 1}`;
	};

	// lifecycle function to load data and variables
	onMount(async () => {
		// fetch the time left until the next day

		// haitus
		/*const res = await fetch('https://api.animeguess.moe/time');
		const time = await res.json();*/

		const time = {"currentDay": 365, "timeUntil": 999999999999999999};
		timeUntil = await time.timeUntil;

		// check if there is a day value inside of the search params and set variables
		let dayUrl = $page.url.search;
		if (dayUrl.length > 0) {
			selectedDay = Number($page.url.search.slice(4));
			currentDay = await time.currentDay;
		} else {
			selectedDay = await time.currentDay;
			currentDay = await time.currentDay;
		}

		if (selectedDay === currentDay) {
			rightDisabled = true;
		} else if (selectedDay - 1 <= 0) {
			leftDisabled = true;
		}

		// once browser is defined create any needed local storage and begin intialization for game
		if (browser) {
			guesses = [];
			state = 'playing';
			let localState = localStorage.getItem(`puzzle${selectedDay}state`);
			let firstVisit = localStorage.getItem(`firstVisit`);
			if (firstVisit !== 'no') {
				showModal = true;
				// localStorage.setItem('firstVisit', 'no');
			}
			if (localState) {
				state = localState;
			} else {
				localStorage.setItem(`puzzle${selectedDay}state`, state);
			}
			let tempArr = [];
			for (let i = 0; i < 6; i++) {
				let guess = localStorage.getItem(`puzzle${selectedDay}guess${i}`);

				if (guess) {
					tempArr.push(guess);
				}
			}
			guesses = tempArr;
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="Anime guesser game" content="Anime guesser game" />
</svelte:head>

<section>
	<div class="info_text" style="text-align: center; margin-bottom: 10px; font-weight: 350; color: white; font-size: 1.2rem;">
		🎉 Thank you for one year of AnimeGuess! 🎉 <br />
		We will be on temporary hiatus; New days will not be added but previous days will remain active!
	</div>
	{#if guesses && state !== ''}
		<Game {state} {guesses} currentDay={selectedDay} />
	{/if}
</section>
<section>
	<div class="clock__section">
		<button class="arrow_button" disabled={leftDisabled} on:click={() => moveDay('left')}>
			<Fa icon={faCaretLeft} />
			<div>Previous Day</div>
		</button>
		<Clock {timeUntil} />
		<button class="arrow_button" disabled={rightDisabled} on:click={() => moveDay('right')}>
			<div>Next Day</div>
			<Fa icon={faCaretRight} />
		</button>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.clock__section {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.arrow_button {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		border: none;
		border-radius: 5px;
		color: white;
		background-color: var(--color-theme-2);
	}
	.arrow_button:disabled {
		color: rgba(16, 16, 16, 0.3);
	}
</style>
