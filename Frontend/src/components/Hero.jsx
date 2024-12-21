import React from 'react';

function Hero() {
  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-br from-teal-400 to-purple-600 rounded-full blur-3xl opacity-50 animate-float" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-2xl opacity-40 animate-float-reverse" />
                </div>
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
