import { inspect } from "@xstate/inspect"
// NextJS / Xstate funky tomfoolery..
if (typeof window !== "undefined") {
  inspect({
    iframe: false,
  })
}

import React from "react"
import bettingGame from "../machines/betting-game.machine.js"
import { useMachine } from "@xstate/react"

import "styles/index.css"

export default function App({ Component, pageProps }) {
  const [state] = useMachine(bettingGame, { devTools: true })

  return <Component {...pageProps} />
}
