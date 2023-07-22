# AnimeGuess.Moe

This app has been created with create [Svelte App](https://github.com/animeguesser/anime-frontend/blob/main/createSvelte.md).

## Inspiration

Anime Guess is a daily puzzle game inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html), [Framed.wtf](https://framed.wtf/) and [GuessTheGame](https://guessthe.game/)
This game applys the formula to the medium of anime while maintaining a slim and performant application.

## Structure

The Main files are located within the routes folder withing the src directory. There is no component directory and all components are either within the page themselves or at the same level within the route they are used. This is to create easy to read and navigate filed as you will see all components and code for each route within it's route directory.

There are only two routes within this app

- Main (index)
- PlayerHistory

## Run Localy

To run a local instance of your app:

```bash
npm run dev
```

then navigate to http://localhost:5173/ to access the build
