<script>
	import logo from '$lib/images/AG_BW_Logo.svg';
	import github from '$lib/images/github.svg';
	import Modal from './Modal.svelte';

	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCircleInfo, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

	// import lifecyle and browser to safely use local state
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let showInstruction = false;
	let showAbout = false;

	onMount(async () => {
		if (browser) {
			let firstVisit = localStorage.getItem(`firstVisit`);
			if (firstVisit !== 'no') {
				showInstruction = true;
				localStorage.setItem('firstVisit', 'no');
			}
		}
	});
</script>

<Modal bind:showModal={showInstruction}>
	<h2 slot="header" class="instruction__header">How to Play</h2>

	<ol class="instruction">
		<li class="list-item">Guess the anime based off of the six images provided.</li>
		<li class="list-item">Each new picture will progressively be easier.</li>
		<li class="list-item">
			Type within the searchbox for an anime and select from within the list.
		</li>
		<li class="list-item">
			No guess? No problem just hit the skip button to try and get a better idea!
		</li>
	</ol>
</Modal>

<Modal bind:showModal={showAbout}>
	<h2 slot="header" class="instruction__header">
		Hello!
		<small>よー!</small>
	</h2>

	<ol class="instruction">
		<li class="list-item">
			Anime Guess is a daily puzzle game inspired by <a
				href="https://www.nytimes.com/games/wordle/index.html">Wordle</a
			>, <a href="https://framed.wtf/">Framed</a> and
			<a href="https://guessthe.game/">GuessTheGame</a>
		</li>
		<li class="list-item">
			Every 24hrs a new set of images will be shared from an anime. These images will hopefully help
			you identify the aesthtic, character, context, and eventually the title of the anime.
		</li>
		<li class="list-item">
			All Titles of anime will be in the Romaji and will match the answers as such. However, you can
			still type in the english title or other synonym while seaching. This will give you the Romaji
			title followed by the closest matching synonym.
		</li>
		<li class="list-item">Eg. Kimi no Na wa [Your Name]</li>
		<li class="list-item">
			We strive to create a game that is fun to play, challenging, and fufilling for individuals and
			communities. As such we will make selections for anime that are relevant to a large and
			diverse group of anime watchers (young, old, otaku, or casual). There will be a number of
			challenging selections as well easier answers and we hope that either way we can satisfy many
			players with exciting puzzles.
		</li>
	</ol>
	<ol class="instruction">
		<li class="list-item__small">Additional Info:</li>
		<li class="list-item__small">
			This Project is Open Source and can be viewed by clicking the github logo in the top left
			corner of the screen. If the game grows in popularity we will implement a feature to take in
			community submissions until then all the puzzles will be designed by us. This game is also
			currently in Alpha and is subject to change drastically at anytime, thanks for playing!
		</li>
	</ol>
</Modal>

<header>
	<div class="corner">
		<a href="https://github.com/animeguesser">
			<img src={github} alt="GitHub" />
		</a>
	</div>

	<a href="https://www.animeguess.moe/">
		<img src={logo} class="logo" />
	</a>

	<div class="corner info">
		<div on:click={() => (showInstruction = true)}><Fa icon={faCircleQuestion} /></div>
		<div on:click={() => (showAbout = true)}><Fa icon={faCircleInfo} /></div>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		padding-top: 20px;
	}

	.corner {
		width: 3em;
		height: 3em;
		color: white;
	}

	.corner a {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-2);
	}

	.info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.logo {
		width: 20vw;
		max-width: 10rem;
	}

	@media (max-width: 500px) {
		.logo {
			width: 35vw;
		}
	}
	.instruction {
		background-color: var(--color-theme-2);
		color: white;
		max-height: 70vh;
		padding-left: 20px;
	}
	.instruction__header {
		font-size: 1.2rem;
		font-weight: 700;
	}
	.list-item {
		list-style-type: none;
		padding-top: 0.5rem;
	}
	.list-item__small {
		list-style-type: none;
		font-size: 0.5rem;
	}
	a {
		color: var(--color-theme-1);
	}
</style>
