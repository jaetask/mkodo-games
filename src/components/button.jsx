import React from "react"
import { noop } from "../lib/utils"

/**
 * We want _most_ buttons to look the same, we will add danger, success modes etc
 *
 */
const Button = ({ onClick = noop, children }) => (
  <button
    className="px-4 py-2 font-sans font-medium text-white bg-blue-500 rounded hover:bg-blue-700 transition transition-colors-300"
    onClick={() => (onClick ? onClick() : null)}
  >
    {children}
  </button>
)

export default Button
