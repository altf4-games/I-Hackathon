import React, { Suspense } from 'react';
import sampleArcs from "../data/SampleArcs";
import globeConfig from "../data/GlobeConfig";

const World = React.lazy(() => import("./ui/globe"));

function Hero() {
  return (
    <div className="min-h-screen sm:grid sm:grid-cols-2 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-16">
      <section className='sm:pl-16 z-10 sm:text-left text-center'>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold italic">
          Create <div className='text-cyan-400 text-4xl sm:text-5xl lg:text-8xl'>Experience</div>
        </h1>
        <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold italic'>with <div className='text-cyan-400 text-4xl sm:text-5xl lg:text-8xl'>Travelling</div></h1>
        <p className=''></p>
        <button className="px-3 md:text-2xl text-xl sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-transform mt-2 sm:mt-8">
          Get Started
        </button>
      </section>
      <div className=" absolute sm:relative lg:h-[35rem] md:h-[30rem] h-[27rem] w-full">
          <Suspense fallback={<div className="text-white">Loading...</div>}>
            <World data={sampleArcs} globeConfig={globeConfig} />
          </Suspense>
          <div className="absolute top-0 md:hidden h-[20rem] w-full bg-transparent"/>
        </div>
    </div>
  );
}

export default Hero;
