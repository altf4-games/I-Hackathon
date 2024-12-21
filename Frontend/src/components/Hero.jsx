import React from 'react'

function Hero() {
  return (
    <div className='min-h-screen h-full w-full flex flex-col justify-center items-center'>
        <h1 className='text-8xl text-center font-bold'>Create Experience <br /> With Traveling</h1>
        <p className='text-2xl text-gray-300 text-center mt-4'>Seamless journeys powered by blockchain, sustainable choices, and exclusive perks</p>
        <button className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-transform mt-8'>Get Started</button>
    </div>
  )
}

export default Hero