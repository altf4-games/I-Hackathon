import React from 'react';
import { motion } from 'framer-motion';

function Hero() {
  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Floating Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-br from-teal-400 to-purple-600 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-2xl"
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Main Content */}
      <motion.h1
        className="text-3xl sm:text-4xl lg:text-6xl text-center font-bold leading-snug"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        Create Experience <br /> With Traveling
      </motion.h1>
      <motion.p
        className="text-base sm:text-lg lg:text-xl text-gray-300 text-center mt-4 sm:mt-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        Seamless journeys powered by blockchain, sustainable choices, and exclusive perks
      </motion.p>
      <motion.button
        className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-transform mt-6 sm:mt-8"
        whileHover={{ scale: 1.2, backgroundColor: '#4c51bf' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Get Started
      </motion.button>
    </div>
  );
}

export default Hero;
