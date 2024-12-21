import React from 'react';

function Hero() {
  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl text-center font-bold leading-snug">
        Create Experience <br /> With Traveling
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-gray-300 text-center mt-4 sm:mt-6">
        Seamless journeys powered by blockchain, sustainable choices, and exclusive perks
      </p>
      <button className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-transform mt-6 sm:mt-8">
        Get Started
      </button>
    </div>
  );
}

export default Hero;
