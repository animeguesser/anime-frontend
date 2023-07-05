<script lang="ts">
	export let timeUntil = 0;

	$: hoursRemain = Math.floor(timeUntil / 3600);
	$: minutesRemain = Math.floor((timeUntil - hoursRemain * 3600) / 60);
	$: secondsRemain = Math.floor(timeUntil - hoursRemain * 60 * 60 - minutesRemain * 60);

	const updateTime = () => {
		secondsRemain -= 1;
		if (secondsRemain == 0) {
			minutesRemain -= 1;
			if (minutesRemain == 0) {
				hoursRemain -= 1;
			} else if (minutesRemain < 0) {
				minutesRemain = 59;
			}
		} else if (secondsRemain < 0 && minutesRemain > 0 && hoursRemain >= 0) {
			secondsRemain = 59;
		}
	};

	setInterval(updateTime, 1000);
</script>

<div class="clock">
	<div class="clock-viewport">
		<div class="clock-digits" style="transform: translate(0, {100}%)">
			<strong class="hidden" aria-hidden="true">
				<span class="minutes">{hoursRemain < 10 ? `0${hoursRemain}` : hoursRemain}</span>h
				<span class="minutes">{minutesRemain < 10 ? `0${minutesRemain}` : minutesRemain}</span>m
				<span class="secs"
					>{secondsRemain < 10 && secondsRemain > 0 ? `0${secondsRemain}` : secondsRemain}s</span
				>
			</strong>
		</div>
	</div>
</div>

<style>
	.clock {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
	}

	.clock-viewport {
		width: 50rem;
		height: 20rem;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.clock-viewport strong {
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

	.clock-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
