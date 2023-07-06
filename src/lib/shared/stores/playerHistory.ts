import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = '0';
const initialValue = browser
	? window.localStorage.getItem('playerHistory')
	: defaultValue ?? defaultValue;

const playerHistory = writable<string>(initialValue);

playerHistory.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem(`playerHistory`, value);
	}
});

export default playerHistory;
