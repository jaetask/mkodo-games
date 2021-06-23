import { Machine } from "xstate"

const bettingGame = Machine({
  id: "bettingGame",
  context: {},
  initial: "idle",
  states: {
    idle: {},
  },
})

export default bettingGame
