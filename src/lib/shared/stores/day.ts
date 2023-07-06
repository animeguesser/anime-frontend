import { browser } from '$app/environment';
import { writable } from 'svelte/store';
 
const defaultValue = '0';
const initialValue = browser ? window.localStorage.getItem('day') ?? defaultValue : defaultValue;
 
const day = writable<string>(initialValue);
 
day.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('day', value);
  }
});
 
export default day;