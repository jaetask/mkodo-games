import React from "react"

const Home = () => {
  return (
    <>
      <div className="p-4">
        <button className="px-4 py-2 font-sans font-medium text-white bg-blue-500 rounded hover:bg-blue-700">
          Button
        </button>
      </div>
      <iframe
        title="inspector"
        className="w-full h-screen"
        data-xstate="xstate"
      />
    </>
  )
}

export default Home
