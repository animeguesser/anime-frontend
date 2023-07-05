<script lang="ts">
	import { tweened } from 'svelte/motion';
	import moment from 'moment';

	const res = fetch('http://0.0.0.0:8000/time');

	let timeUntil;
	res.then((r) => {
		timeUntil = r;
		console.log(timeUntil);
	});

	const now = moment();
	const eod = moment().endOf('day');

	let clock = moment.duration(moment(eod).diff(now));

	$: hoursRemain = clock.hours();
	$: minutesRemain = clock.minutes();
	$: secondsRemain = clock.seconds();

	const updateTime = () => {
		secondsRemain -= 1;
		if (secondsRemain == 0) {
			minutesRemain -= 1;
			if (minutesRemain == 0) {
				hoursRemain -= 1;
			} else if (minutesRemain < 0) {
				minutesRemain = 60;
			}
		} else if (secondsRemain < 0) {
			secondsRemain = 60;
		}
	};

	setInterval(updateTime, 1000);
</script>

<div class="clock">
	<div class="clock-viewport">
		<div class="clock-digits" style="transform: translate(0, {100}%)">
			<strong class="hidden" aria-hidden="true">
				<span class="minutes">{hoursRemain < 10 ? `0${hoursRemain}` : hoursRemain}</span>:
				<span class="minutes">{minutesRemain < 10 ? `0${minutesRemain}` : minutesRemain}</span>:
				<span class="secs"
					>{Math.floor(secondsRemain) < 10 ? `0${secondsRemain}` : secondsRemain}</span
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
