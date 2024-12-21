import React, { useState } from "react";
import { PayEmbed } from "thirdweb/react";
import { client } from "../client";

function UserProfile() {
  const [profile, setProfile] = useState({
    username: "Username",
    wallet: "0x123...456",
    travelType: "Adventure",
    budget: "$2000 - $5000",
    interests: "Hiking, Photography, Blockchain Events",
    image: "https://via.placeholder.com/100",
    points: "100"
  });

  const [imagePreview, setImagePreview] = useState(profile.image);
  const [showPayEmbed, setShowPayEmbed] = useState(false);

  const handleEditClick = () => {
    setFormData({ ...profile });
    setImagePreview(profile.image);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...formData, image: imagePreview });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  return (
    <div className="min-h-screen text-white m-6 p-6 sm:grid sm:grid-cols-2 flex flex-col justify-center items-center">
      <section className="px-4 md:border-r-4 md:border-y-white">
      <div className="max-w-full  bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Profile Section */}
          <div className="flex flex-col items-center space-y-6 sm:space-y-0">
            <img
              src={profile.image || "https://picsum.photos/200"}
              alt="User Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 hover:shadow-xl transition-transform transform hover:scale-110"
            />
            <div className="text-center">
              <h2 className="text-4xl font-bold">{profile.username}</h2>
              <p className="text-gray-400 mt-2">Wallet: {profile.wallet}</p>
              <p className="text-gray-400 font-bold">Loyalty Points: {profile.points}</p>
            </div>
          </div>

        {/* Buy ETH with Fiat Button */}
        <div className="text-center">
          <button
            onClick={() => setShowPayEmbed(!showPayEmbed)}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            {showPayEmbed ? "Hide Buy ETH with Fiat" : "Buy ETH with Fiat"}
          </button>
        </div>

        <div className="text-center">
          <button
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            Claim Insurance
          </button>
        </div>

        {showPayEmbed && (
          <div className="flex flex-col justify-center items-center  bg-gray-800/80 text-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto space-y-6 transform transition duration-500 hover:scale-105 hover:shadow-purple-500/50 mt-10">
            <h3 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in">
              Buy ETH with Fiat
            </h3>
            <PayEmbed client={client}/>
          </div>
        )}
        </div>
      </section>
      <section className="grid grid-rows-2 px-4">
        <div className="h-full w-full flex flex-col justify-start items-start">
          <h2 className="text-2xl font-bold w-full">Rewards</h2>
          <div className="h-36 w-full flex justify-center items-center bg-gray-800 opacity-45 rounded-2xl my-4">
            No Rewards yet!!!
          </div>

        </div>
        <div className="h-full w-full flex flex-col justify-start items-start">
        <h2 className="text-2xl font-bold w-full">Purchased Tickets</h2>
          <div className="h-36 w-full flex justify-center items-center bg-gray-800 opacity-45 rounded-2xl my-4">
            No Purchased tickets yet !!!
          </div>
        </div>
      </section>
    </div>


      
    )
  }

export default UserProfile;