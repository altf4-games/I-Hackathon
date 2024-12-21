import React from 'react';
import stepsData from '../data/HowItWorksData';

function HowItWorks() {
  return (
    <div className='w-full h-full bg-indigo-800 rounded-2xl'>
        <section className='p-16 mb-6'>
            <h3 className='text-2xl mb-8'>How It Works?</h3>
            <h1 className='text-6xl font-bold mt-4'>Simple, Secure and Fun</h1>
        </section>
        <section className='w-full h-full flex flex-col'>
            {stepsData.map((step, index) => (
                <div
                    key={index}
                    className={`grid grid-cols-2 items-center p-16 ${index % 2 === 0 ? 'bg-indigo-900' : 'bg-indigo-800'}`}
                >
                    <div className='flex items-center gap-4 w-full'>
                        <div className='text-4xl font-bold text-white'>{step.step}</div>
                        <h2 className='text-3xl font-semibold text-white'>{step.title}</h2>
                    </div>
                    <p className='text-2xl text-gray-300 mt-4 md:mt-0 md:ml-8'>
                        {step.description}
                    </p>
                </div>
            ))}
        </section>
    </div>
  )
}

export default HowItWorks