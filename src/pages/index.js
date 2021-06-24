import React from "react"
import bettingGame from "../machines/betting-game.machine.js"
import { useMachine } from "@xstate/react"
import Button from "../components/button"
import Page from "../components/page"
import Header from "../components/header"
import { dollars } from "../lib/utils"

/**
 * Important to pass an API, these component should have no idea they
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
            className="bg-gray-200 text-gray-800 hover:bg-green-600 hover:text-white text-xl rounded-3xl border-2 p-2 text-center capitalize"
            onClick={() => api.selectGame(game.id)}
          >
            <div className="text-xs p-1">{game.tagLine}</div>
            <div className="text-3xl md:text-4xl font-black py-2">
              {game.name}
            </div>
            <div className="text-xl md:text-2xl font-black py-1">
              {game.brand}
            </div>
            <div className="text-xs p-1">{game.description}</div>
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
  if (Array.isArray(bets) && bets.length > 0) {
    return (
      <div className="px-4 mt-4 text-center grid grid-flow-row md:grid-flow-row md:grid-cols-2 gap-4">
        {bets.map((bet) => {
          // I WOULD NORMALLY USE CLASSNAMES WITH THIS KIND OF LOGIC
          // BUT I HAVE HIT THE NPM INSTALL LIMIT
          const bg = selected?.id === bet.id ? "bg-green-600" : "bg-gray-200"
          // we only want the text to change when there is nothing seelcted
          const textColor =
            selected?.id === bet.id ? "text-white" : "text-green-600"
          const hover = selected ? "" : "hover:bg-green-600"
          const hoverText = selected ? "" : "group-hover:text-white"

          return (
            <div
              key={bet.id}
              className={`group ${bg} text-gray-800 ${hover} border-2 rounded-xl p-8 text-center h-full w-full min-h-0`}
              onClick={() => (selected ? undefined : api.selectBet(bet.id))}
            >
              <div className={`${textColor} ${hoverText} text-lg pb-1`}>
                {bet.name}
              </div>
              <div className="text-sm font-light">{bet.startDate}</div>
              <div
                className={`${textColor} ${hoverText} text-xl font-semibold border-t-2 border-b-2 border-gray-400 my-4 py-2`}
              >
                {bet.tagLine}
              </div>
              <div
                className={`${textColor} ${hoverText} text-lg font-semibold `}
              >
                {dollars(bet.baseValue, 0)} returns
              </div>
              <div
                className={`${textColor} ${hoverText} text-3xl font-semibold `}
              >
                {dollars(bet.baseValue * bet.roiP)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

const Stake = ({ children }) => (
  <div className="bg-gray-300 text-xs sm:text-base md:text-lg text-green-600 px-2 sm:px-8 md:px-10 py-1 md:py-2 mt-1 md:mt-2 rounded ">
    {children}
  </div>
)
const PickBetHeader = () => (
  <p className="text-center pt-4 md:pt-6 text-2xl md:text-4xl">Pick a bet</p>
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
          <p className="">mkodo</p>
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
            <PickBetHeader />
            <BetList
              bets={selectedGame?.bets || []}
              api={api}
              selected={selectedBet}
            />
          </>
        ) : null}
        {state.matches("loaded.gameSelected.betView") ? (
          <>
            <PickBetHeader />
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
