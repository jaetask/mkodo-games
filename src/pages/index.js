import React from "react"
import bettingGame from "../machines/betting-game.machine.js"
import { useMachine } from "@xstate/react"
import Button from "../components/button"
import Page from "../components/page"
import Header from "../components/header"
import { dollars } from "../lib/utils"

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
            className="bg-gray-200 text-gray-800 hover:bg-indigo-200 rounded border-2 p-8 text-center"
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

/**
 * Hover and onClick events disabled when a current BET is selected
 */
const BetList = ({ bets, api, selected }) => {
  console.log(bets)
  if (Array.isArray(bets) && bets.length > 0) {
    return (
      <div className="px-4 mt-8 text-center grid grid-flow-row md:grid-flow-row md:grid-cols-2 gap-4">
        {bets.map((bet) => {
          const bg = selected?.id === bet.id ? "bg-indigo-200" : "bg-gray-200"
          const hover = selected ? "" : "hover:bg-indigo-200"

          return (
            <div
              key={bet.id}
              className={`${bg} text-gray-800 ${hover} border-2 rounded p-8 text-center h-full w-full min-h-0`}
              onClick={() => (selected ? undefined : api.selectBet(bet.id))}
            >
              <div>{bet.name}</div>
              <div>{bet.startDate}</div>
              <div>{bet.tagLine}</div>
              <div>{dollars(bet.baseValue)} returns</div>
              <div>{dollars(bet.baseValue * bet.roiP)}</div>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

const Stake = ({ children }) => (
  <div className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-tiny">
    {children}
  </div>
)

const Home = () => {
  const [state, send] = useMachine(bettingGame, { devTools: true })
  const { games, selectedGame, selectedBet } = state.context
  const api = {
    loadGames: () => send("LOAD_GAMES"),
    selectGame: (id) => send({ type: "SELECT_GAME", id }),
    selectBet: (id) => send({ type: "SELECT_BET", id }),
    back: () => send("BACK"),
    next: () => send("NEXT"),
  }
  return (
    <Page>
      {state.matches("idle") || state.matches("loaded.gameListView") ? (
        <Header>
          <h1 className="text-6xl">mkodo</h1>
        </Header>
      ) : null}
      <div className="bg-gray-700 flex flex-col flex-grow min-h-screen pb-8">
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
            <BetList
              bets={selectedGame?.bets || []}
              api={api}
              selected={selectedBet}
            />
          </>
        ) : null}
        {state.matches("loaded.gameSelected.betView") ? (
          <>
            <p className="text-center text-4xl pt-8">Pick a bet</p>
            <BetList
              bets={selectedGame?.bets || []}
              api={api}
              selected={selectedBet}
            />
          </>
        ) : null}
        {state.matches("loaded.gameSelected.betView.chooseEntryLevel") ? (
          <div className="sticky inset-x-0 overflow-auto bottom-0 min-h-100 bg-gray-800 text-gray-200 p-4 text-xxs">
            <div className="flex flex-row justify-between border-b-2 border-gray-200 py-2">
              <div className="">{selectedBet.tagLine}</div>
              <div className="">{dollars(selectedBet.baseValue)}</div>
            </div>
            <div className="flex flex-col py-2">
              <div className="">Stake:</div>
              <div className="flex flex-row justify-between">
                <Stake>{dollars(5)}</Stake>
                <Stake>{dollars(10)}</Stake>
                <Stake>{dollars(20)}</Stake>
                <Stake>{dollars(50)}</Stake>
                <Stake>Other</Stake>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  )
}

export default Home
