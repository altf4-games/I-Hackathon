import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from '../client'

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-black fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="flex items-center justify-between p-5 max-w-7xl mx-auto">
        <motion.div
          className="text-cyan-400 text-4xl font-extrabold cursor-pointer hover:text-pink-500 transform transition-all duration-500 ease-in-out uppercase"
          whileHover={{ color: "#FF00FF" }}
          onClick={() => navigate('/')}
        >
          Voyage3
        </motion.div>
        {
          isWalletConnected ? (
            <div className="hidden md:flex space-x-10 items-center">
              {["Booking", "MarketPlace", "Rewards", "Community", "Profile"].map((link) => (
                <motion.div
                  key={link}
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                >
                  <div
                    onClick={() => navigate(link === "Home" ? "/" : `/${link.toLowerCase()}`)}
                    className="text-white font-mono text-lg border-b-2 border-transparent hover:border-cyan-400 transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    {link}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="hidden md:flex space-x-10 items-center">
              {["How it Works?", "Features", "Testimonials", "FAQ"].map((link) => (
                <motion.div
                  key={link}
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                >
                  <a href={`#${link}`}>
                  <div
                    className="text-white font-mono text-lg border-b-2 border-transparent hover:border-cyan-400 transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    {link}
                  </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )
        }


        <div className="hidden md:flex space-x-5">
          <ConnectButton client={client} wallets={wallets}
            onConnect={(wallet) => {
              setIsWalletConnected(true);
              navigate('/booking');
            }}
            onDisconnect={() => {
              navigate('/');
              setIsWalletConnected(false);
             }}
          />
        </div>

        <div
          className="md:hidden flex flex-col items-center space-y-2 cursor-pointer"
          onClick={toggleMenu}
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
      </div>

      {/* {isMenuOpen && (
        <motion.div
          className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-100 flex flex-col items-center justify-center space-y-6 text-white"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >

          {(isWalletConnected?(["Booking", "MarketPlace", "Rewards", "Community", "Profile"]):(["Home", "How it Works?", "Features", "Testimonials", "FAQ"])).map((link) => (
            <div
              key={link}
              onClick={() => {
                navigate(link === "Home" ? "/" : `/${link.toLowerCase()}`);
                toggleMenu();
              }}
              className="text-2xl font-mono text-white hover:text-cyan-500 transition-all duration-300 ease-in-out cursor-pointer"
            >
              {link}
            </div>
          ))}
        </motion.div>
        
      )} */}
      {isMenuOpen && (
      <motion.div
        className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-100 flex flex-col items-center justify-center space-y-6 text-white"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Close Menu Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-5 right-5 text-white bg-red-600 px-4 py-2 rounded-md text-lg hover:bg-red-700 transition-all duration-300"
        >
          X
        </button>

        {/* Navigation Links */}
        {(isWalletConnected
          ? ["Booking", "MarketPlace", "Rewards", "Community", "Profile"]
          : ["Home", "How it Works?", "Features", "Testimonials", "FAQ"]
        ).map((link) => (
          <div
            key={link}
            onClick={() => {
              navigate(link === "Home" ? "/" : `/${link.toLowerCase()}`);
              toggleMenu();
            }}
            className="text-2xl font-mono text-white hover:text-cyan-500 transition-all duration-300 ease-in-out cursor-pointer"
          >
            {link}
          </div>
        ))}

        {/* Connect Wallet Button */}
        {!isWalletConnected && (
          <ConnectButton
            client={client}
            wallets={wallets}
            className="bg-cyan-500 px-4 py-2 rounded-md text-white font-semibold text-lg hover:bg-cyan-600 transition-all duration-300"
            onConnect={(wallet) => {
              setIsWalletConnected(true);
              navigate("/booking");
              toggleMenu();
            }}
            onDisconnect={() => {
              setIsWalletConnected(false);
              toggleMenu();
            }}
          />
        )}
      </motion.div>
    )}

    </nav>
  );
}

export default Navbar;