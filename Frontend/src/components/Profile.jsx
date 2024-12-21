import React, { useState } from "react";

function UserProfile() {
  const [profile, setProfile] = useState({
    username: "Username",
    wallet: "0x123...456",
    travelType: "Adventure",
    budget: "$2000 - $5000",
    interests: "Hiking, Photography, Blockchain Events",
    image: "https://via.placeholder.com/100",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(profile.image);

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
    <div className="min-h-screen text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
          <img
            src="https://picsum.photos/200"
            alt="User Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 hover:shadow-xl transition-transform transform hover:scale-110"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-4xl font-bold">{profile.username}</h2>
            <p className="text-gray-400 mt-2">Wallet: {profile.wallet}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Travel Type</h4>
              <p className="text-lg font-medium">{profile.travelType}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-400 uppercase">Budget</h4>
              <p className="text-lg font-medium">{profile.budget}</p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <h4 className="text-sm text-gray-400 uppercase">Interests</h4>
              <p className="text-lg font-medium">{profile.interests}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="text-center">
          <button
            onClick={handleEditClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="absolute z-50 top-24 bg-black bg-opacity-100 flex justify-center items-center">
          <div className="w-full max-w-lg bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-center">Edit Profile</h3>
            <div className="space-y-4">
              {[
                { label: "Username", name: "username", type: "text", value: formData.username },
                { label: "Wallet Address", name: "wallet", type: "text", value: formData.wallet },
                { label: "Travel Type", name: "travelType", type: "text", value: formData.travelType },
                { label: "Budget", name: "budget", type: "text", value: formData.budget },
                { label: "Interests", name: "interests", type: "text", value: formData.interests },
              ].map((input) => (
                <div key={input.name}>
                  <label className="block text-gray-400 text-sm">{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    value={input.value}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-400 text-sm">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 mt-4 rounded-full border-2 border-blue-500"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;