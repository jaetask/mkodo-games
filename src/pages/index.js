import React from "react"
import bettingGame from "../machines/betting-game.machine.js"
import { useMachine } from "@xstate/react"
import Button from "../components/button"
import Page from "../components/page"
import Header from "../components/header"
import format from "date-fns/format"

/**
 * Important to pass an API, these component sbhould have no idea they
 * are interacting with a state machine.
 * Makes them easy to test and reduces the spread of logic throughout the app.
 */
const GamesList = ({ games, api }) => {
  if (Array.isArray(games) && games.length > 0) {
    return (
      <div className="p-12 space-y-8">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded border-2 p-8 text-center"
            onClick={() => api.selectGame(game.id)}
          >
            <div>{game.tagLine}</div>
            <div>{game.image}</div>
            <div>{game.name}</div>
            <div>{game.description}</div>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const BetList = ({ bets, api }) => {
  console.log(bets)
  if (Array.isArray(bets) && bets.length > 0) {
    return (
      <div className="px-4 mt-8 text-center grid grid-flow-col grid-cols-2 grid-rows-2 gap-4">
        {bets.map((bet) => (
          <div
            key={bet.id}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 border-2 rounded p-8 text-center h-full w-full min-h-0"
            onClick={() => api.selectBet(bet.id)}
          >
            <div>{bet.description}</div>
            <div>{format(new Date(bet.startDate), "YY")}</div>
            <div>{bet.name}</div>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const Home = () => {
  const [state, send] = useMachine(bettingGame, { devTools: true })
  const { games, selectedGame } = state.context
  const api = {
    loadGames: () => send("LOAD_GAMES"),
    selectGame: (id) => send({ type: "SELECT_GAME", id }),
    selectBet: (id) => send({ type: "SELECT_BET", id }),
  }
  return (
    <Page>
      {state.matches("idle") || state.matches("loaded.gameListView") ? (
        <Header>
          <h1 className="text-6xl">mkodo</h1>
        </Header>
      ) : null}
      <div className="bg-gray-700 w-full h-full">
        {state.matches("idle") ? (
          <div className="text-center pt-8 w-full">
            <p className="mb-8">
              An example of loading async data <br />
              <i>(would normally happen automatically)</i>
            </p>
            <Button onClick={() => api.loadGames()}>Load games</Button>
          </div>
        ) : null}
        {state.matches("loaded.gameListView") ? (
          <>
            <p className="text-center pt-8 w-full">
              Choose a game to buy a ticket
            </p>
            <GamesList games={games} api={api} />
          </>
        ) : null}
        {state.matches("loaded.gameSelected.betListView") ? (
          <>
            <p className="text-center text-4xl pt-8">Pick a bet</p>
            <BetList bets={selectedGame?.bets || []} api={api} />
          </>
        ) : null}
      </div>
    </Page>
  )
}

export default Home
