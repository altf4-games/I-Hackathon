import React from 'react'

function MarketPlace() {
  return (
    <div className='mt-36 flex items-start justify-around h-screen'>
      <h1 className='text-6xl font-bold'>Marketplace</h1>
      <div className='flex gap-8'>
        <button className='px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-110'>Buy NFT</button>
        <button className='px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-110'>Sell NFT</button>
      </div>
    </div>
  )
}

export default MarketPlace