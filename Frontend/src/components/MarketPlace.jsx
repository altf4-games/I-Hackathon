import React, { useState } from "react";
import MarketPlaceData from "../data/MarketPlaceData";
import { FaEthereum } from "react-icons/fa";

function MarketPlace() {
  const [profile, setProfile] = useState({
    username: "Username",
    wallet: "0x123...456",
    travelType: "Adventure",
    budget: "$2000 - $5000",
    interests: "Hiking, Photography, Blockchain Events",
    image: "https://via.placeholder.com/100",
    points: 1000,
  });

  return (
    <div className="min-h-screen h-full w-full flex">
      {/* Profile Card */}
      <div className="fixed top-16 left-0 max-w-[300px] w-full bg-indigo-900 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <img
            src="https://picsum.photos/200"
            alt="User Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 hover:shadow-xl transition-transform transform hover:scale-110"
          />
          <div className="text-center">
            <h2 className="text-4xl font-bold">{profile.username}</h2>
            <p className="text-gray-400 mt-2">Wallet: {profile.wallet}</p>
            <p className="text-gray-400 mt-2">Points: {profile.points}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Preferences</h3>
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Travel Type</h4>
              <p className="text-lg font-medium">{profile.travelType}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Budget</h4>
              <p className="text-lg font-medium">{profile.budget}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Interests</h4>
              <p className="text-lg font-medium">{profile.interests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="ml-[320px] w-full flex flex-col items-center mt-24">
        <div className="flex justify-between w-full px-16">
          <h1 className="text-6xl text-center font-bold">MarketPlace</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Sell Ticket</button>
        </div>
        <div className="mt-8 w-full px-16">
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-start py-12 gap-6 w-full px-16">
          {MarketPlaceData.map((marketplace, index) => (
            <div
              key={index}
              className="flex w-full bg-gray-900 text-white overflow-hidden rounded-[28px] p-6 shadow-lg"
            >
              <div className="relative flex justify-between w-full">
                <div>
                  <div className="relative z-10 mb-6 text-2xl font-bold">{marketplace.name}</div>
                  <div className="relative flex gap-2 justify-start items-center z-10 text-lg mb-6"><FaEthereum />{marketplace.price}</div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">See details</button>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Buy Ticket</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketPlace;
