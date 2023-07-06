<script lang="ts">
	import { browser } from '$app/environment';
	import playerHistory from '$lib/shared/stores/playerHistory';

	export let attempts;
	export let currentDay;

	$: currentGame = attempts;

	const submit = async () => {
		let res = false;
		let updateIndex = currentGame.findIndex((attempt) => {
			return attempt === 'O';
		});
		if (!res && updateIndex >= 0) {
			currentGame[updateIndex] = 'X';
			playerHistory.set(JSON.stringify({ ...playerHistory, [currentDay]: currentGame }));
		} else if (res && updateIndex > 0) {
			currentGame[updateIndex] = '!';
		}
	};

	setInterval(submit, 1000);
</script>

<div class="game">
	<div>
		{currentGame}
	</div>
</div>

<style>
	.game {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
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

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
