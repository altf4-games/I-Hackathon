import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import FaqsData from '../data/FaqsData';

function Faqs() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <h1
        className="text-6xl font-bold text-center pt-8"
        id="FAQ"
        style={{ scrollBehavior: 'smooth' }}
      >
        FAQs
      </h1>
      <motion.div
        className="max-w-4xl mx-auto py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {FaqsData.map((faq, index) => (
          <motion.div
            key={index}
            className={`rounded-lg shadow-lg p-6 mb-6 cursor-pointer ${
              index % 2 === 0 ? 'bg-indigo-900' : 'bg-indigo-800'
            }`}
            onClick={() => toggleFaq(index)}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: [0.95, 1], // Adds a slight popping effect
            }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold mb-4 text-white">
                {faq.question}
              </h3>
              {expandedIndex === index ? (
                <FaChevronUp className="text-white" />
              ) : (
                <FaChevronDown className="text-white" />
              )}
            </div>
            {expandedIndex === index && (
              <motion.p
                className="font-semibold text-white"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

export default Faqs;
