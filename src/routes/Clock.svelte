<script lang="ts">
	export let timeUntil = 0;

	$: timeRemaining = timeUntil;
	$: hoursRemain = Math.floor(timeRemaining / 3600);
	$: minutesRemain = Math.floor((timeRemaining - hoursRemain * 3600) / 60);
	$: secondsRemain = Math.floor(timeRemaining - hoursRemain * 3600 - minutesRemain * 60);

	const updateTime = () => {
		timeRemaining -= 1;
	};

	setInterval(updateTime, 1000);
</script>

<div class="clock">
	<div class="clock-viewport">
		<div class="clock-digits" style="transform: translate(0, {100}%)">
			<strong class="hidden" aria-hidden="true">
				<!--hiatus<div>The Next Day will be available in:</div>
				<div>
					<span class="minutes">{hoursRemain < 10 ? `0${hoursRemain}` : hoursRemain}</span>h
					<span class="minutes">{minutesRemain < 10 ? `0${minutesRemain}` : minutesRemain}</span>m
					<span class="secs"
						>{secondsRemain < 10 && secondsRemain >= 0 ? `0${secondsRemain}` : secondsRemain}s</span
					>
				</div>-->
			</strong>
		</div>
	</div>
</div>

<style>
	.clock {
		display: flex;
		margin: 1rem 0;
	}

	.clock-viewport {
		width: 50vw;
		max-width: 30rem;
		height: 6rem;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.clock-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 350;
		color: white;
		font-size: 1.2rem;
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
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		user-select: none;
	}
</style>
