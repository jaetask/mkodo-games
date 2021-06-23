import React from "react"
import bettingGame from "../machines/betting-game.machine.js"
import { useMachine } from "@xstate/react"
import Button from "../components/button"

const Home = () => {
  const [state, send] = useMachine(bettingGame, { devTools: true })
  const { games, selectedGame, selectedBet, error } = state.context
  const api = {
    loadGames: () => send("LOAD_GAMES"),
  }
  return (
    <div className="bg-gray-800 text-gray-200 h-screen">
      <div className="bg-gray-800 text-center text-gray-200 p-4 ">
        <h1 className="text-6xl">mkodo</h1>
      </div>
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
            {Array.isArray(games) && games.length > 0
              ? games.map((game) => <div key={game.id}>{game.name}</div>)
              : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Home
