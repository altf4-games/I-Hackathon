import React from 'react';
import FaqsData from '../data/FaqsData';

function Faqs() {
  return (
    <>
    <h1 className="text-6xl font-bold text-center pt-8" id="FAQ">FAQs</h1>
    <div className="max-w-4xl mx-auto py-12 px-4">
      {FaqsData.map((faq, index) => (
        <div
          key={index}
          className={`rounded-lg shadow-lg p-6 mb-6 ${
            index % 2 === 0 ? 'bg-indigo-900' : 'bg-indigo-800'
          }`}
        >
          <h3 className="text-xl font-bold mb-4">{faq.question}</h3>
          <p className="font-semibold">{faq.answer}</p>
        </div>
      ))}
    </div>
    </>
  );
}

export default Faqs;
