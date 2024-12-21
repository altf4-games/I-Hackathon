import React, { useState, useEffect } from "react";
import RewardsData from "../data/RewardsData";
import { MediaRenderer } from "thirdweb/react";
import { claimTo, getNFT } from "thirdweb/extensions/erc1155";
import { getContract } from "thirdweb";
import { client } from "../client";
import { defineChain } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tokenID = Math.floor(Math.random() * 10);
const nft_contract = getContract({
  client,
  chain: defineChain(84532),
  address: "0x03195b833425BC7016B45b9190A0b62733C68641",
});

function Rewards() {
  const [profile, setProfile] = useState({
    username: "Username",
    wallet: "0x123...456",
    travelType: "Adventure",
    budget: "$2000 - $5000",
    interests: "Hiking, Photography, Blockchain Events",
    image: "https://via.placeholder.com/100",
    points: 1000,
  });

  const [nft, setNft] = useState(null);
  const { mutate: sendTransaction } = useSendTransaction();
  const account = useActiveAccount();
  const userAddress = account ? account.address : "";

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const nftData = await getNFT({
          contract: nft_contract,
          tokenId: BigInt(tokenID),
        });
        setNft(nftData);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        toast.error("Failed to load NFT data.");
      }
    };

    fetchNFTData();
  }, []);

  const claimNFT = async () => {
    if (!userAddress) {
      toast.error("No user address found.");
      return;
    }

    try {
      const tx = await claimTo({
        contract: nft_contract,
        to: userAddress,
        tokenId: BigInt(tokenID),
        quantity: 1n,
      });
      const tHash = await sendTransaction(tx);
      toast.success("NFT claimed successfully!");
    } catch (error) {
      console.error("Error claiming NFT:", error);
      toast.error("Failed to claim NFT.");
    }
  };

  return (
    <div className="min-h-screen h-full w-full flex">
      <ToastContainer />

      {/* Profile Card */}
      <div className="fixed top-16 left-0 max-w-[300px] w-full bg-indigo-900 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <img
            src={profile.image}
            alt="User Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 hover:shadow-xl transition-transform transform hover:scale-110"
          />
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">{profile.username}</h2>
            <p className="text-gray-400 mt-2">Wallet: {profile.wallet}</p>
            <p className="text-gray-400 mt-2">Points: {profile.points}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 text-white">Preferences</h3>
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Travel Type</h4>
              <p className="text-lg font-medium text-white">{profile.travelType}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Budget</h4>
              <p className="text-lg font-medium text-white">{profile.budget}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Interests</h4>
              <p className="text-lg font-medium text-white">{profile.interests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="ml-[320px] w-full flex flex-col items-center mt-24">
        <h1 className="text-6xl text-center font-bold w-full text-white">Claim Rewards</h1>
        <div className="mt-8 w-full px-16">
          <input
            type="text"
            placeholder="Search rewards..."
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-start py-12 gap-6 w-full px-16">
          {RewardsData.map((reward, index) => (
            <div
              key={index}
              className="flex w-full bg-gray-900 text-white overflow-hidden rounded-[28px] p-6 shadow-lg"
            >
              <div className="relative w-full">
                <div className="flex justify-between w-full">
                  <div className="relative z-10 mb-6 text-2xl font-bold">{reward.name}</div>
                  <div className="relative z-10 mb-6 text-2xl font-bold">Required: {reward.points} points</div>
                </div>
                <div className="relative flex gap-2 justify-start items-center z-10 text-lg mb-6">{reward.description}</div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Claim Rewards</button>
              </div>
            </div>
          ))}
        </div>

        {nft === null ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="flex flex-col items-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all"
              onClick={claimNFT}
            >
              Claim NFT
            </button>

            {nft && (
              <div className="mt-6 text-center">
                <div className="flex justify-center items-center">
                  <MediaRenderer client={client} src={nft.metadata.image} />
                </div>
                <p className="mt-4 text-xl font-semibold text-white">{nft.metadata.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rewards;
