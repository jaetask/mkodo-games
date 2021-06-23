import { Machine, assign } from "xstate"

import games from "../fixtures/games.json"

// Async call to API, change to reject to demo an error
// could be fetch, axios of whatever..
const loadGamesFromApi = (context, event) => Promise.resolve(games)

const bettingGame = Machine(
  {
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
            id: "gameListView",
            on: {
              SELECT_GAME: {
                target: "gameSelected",
                actions: assign({
                  selectedGame: (context, event) =>
                    context.games.find((x) => x.id === event.id),
                }),
              },
            },
          },
          gameSelected: {
            initial: "betListView",
            states: {
              betListView: {
                id: "betListView",
                on: {
                  SELECT_BET: {
                    target: "betView",
                    actions: assign({
                      selectedBet: (context, event) =>
                        context.selectedGame.bets.find(
                          (x) => x.id === event.id,
                        ),
                    }),
                  },
                  BACK: {
                    target: "#gameListView",
                    actions: "clearSelectedGame",
                  },
                },
              },
              betView: {
                initial: "chooseEntryLevel",
                states: {
                  chooseEntryLevel: {
                    on: {
                      BACK: {
                        target: "#betListView",
                      },
                      NEXT: {
                        target: "confirmEntryLevel",
                      },
                    },
                  },
                  confirmEntryLevel: {
                    on: {
                      BACK: {
                        target: "chooseEntryLevel",
                      },
                      NEXT: {
                        target: "validatePayment",
                      },
                    },
                  },
                  validatePayment: {
                    on: {
                      BACK: {
                        target: "confirmEntryLevel",
                      },
                      NEXT: {
                        target: "paymentValidated",
                      },
                    },
                  },
                  paymentValidated: {
                    after: {
                      3000: "#betListView",
                    },
                  },
                  paymentValidationError: {
                    after: {
                      3000: "validatePayment",
                    },
                  },
                },
              },
            },
          },
        },
      },
      failure: {},
    },
  },
  {
    actions: {
      clearSelectedGame: assign({
        selectedGame: undefined,
        selectedBet: undefined,
      }),
    },
  },
)

export default bettingGame
