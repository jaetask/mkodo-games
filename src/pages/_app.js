import { inspect } from "@xstate/inspect"

// NextJS / Xstate funky tomfoolery..
if (typeof window !== "undefined") {
  inspect({
    iframe: false,
  })
}

// inspector needs to go first! ignore this eslint error
import React from "react"
import "styles/index.css"

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
