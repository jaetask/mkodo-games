import { Machine, assign } from "xstate"

import games from "../fixtures/games.json"

// Async call to API, change to reject to demo an error
// could be fetch, axios of whatever..
const loadGamesFromApi = (context, event) => Promise.resolve(games)

const bettingGame = Machine({
  id: "bettingGame",
  context: {
    error: undefined,
    games: [],
    selectedGame: undefined,
    selectedBet: undefined,
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        LOAD_GAMES: "loadGames",
      },
    },
    loadGames: {
      invoke: {
        id: "loadGamesData",
        src: loadGamesFromApi,
        onDone: {
          target: "loaded.gameListView",
          actions: assign({ games: (_, event) => event.data }),
        },
        onError: {
          target: "failure",
          actions: assign({
            error: (_, event) => ({
              message: "Unable to load game data",
              data: event.data,
            }),
          }),
        },
      },
    },
    loaded: {
      intiial: "gameListView",
      states: {
        gameListView: {
          on: {
            SELECT_GAME: {
              target: "gameSelected",
            },
          },
        },
        gameSelected: {
          initial: "betListView",
          states: {
            betListView: {
              on: {
                SELECT_BET: {
                  target: "betView",
                },
              },
            },
            betView: {
              initial: "chooseEntryLevel",
              states: {
                chooseEntryLevel: {},
                confirmEntryLevel: {},
                validatePayment: {},
                paymentValidated: {},
                paymentValidationError: {},
              },
            },
          },
        },
      },
    },
    failure: {},
  },
})

export default bettingGame
