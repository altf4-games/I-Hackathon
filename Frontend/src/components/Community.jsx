import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
const Community = () => {
  const [newThreadModal, setNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadText, setNewThreadText] = useState("");
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null); 
  const contractAddress = "0x79481aE0c1b6d7340b148c5063a072212A073DD1";
  const abi = [
    {
      inputs: [{ internalType: "string", name: "_title", type: "string" }, { internalType: "string", name: "_text", type: "string" }],
      name: "createThread",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllThreads",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "address", name: "creator", type: "address" },
            { internalType: "string", name: "title", type: "string" },
            { internalType: "string", name: "text", type: "string" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
          ],
          internalType: "struct CommunityBoard.Thread[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const provider = new ethers.providers.Web3Provider(window.ethereum) 
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  useEffect(() => {
    loadThreads();
  }, []);
  const notify = (type, message) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };
  const loadThreads = async () => {
    try {
      const allThreads = await contract.getAllThreads();
      const formattedThreads = allThreads.map((thread) => ({
        id: thread.id.toNumber(),
        title: thread.title,
        text: thread.text,
        lastActivity: new Date(thread.timestamp.toNumber() * 1000).toLocaleString(),
        creator: thread.creator,
      }));
      setThreads(formattedThreads);
    } catch (error) {
      console.error("Failed to load threads:", error);
      notify("error", "Failed to load threads from the blockchain");
    }
  };
  const handleNewThread = () => setNewThreadModal(true);
  const handlePostThread = async () => {
    if (newThreadTitle.trim() && newThreadText.trim()) {
      try {
        const tx = await contract.createThread(newThreadTitle, newThreadText);
        await tx.wait();
        notify("success", "Thread created on the blockchain!");
        setNewThreadTitle("");
        setNewThreadText("");
        setNewThreadModal(false);
        loadThreads();
      } catch (error) {
        console.error("Error creating thread:", error);
        notify("error", "Failed to create thread");
      }
    } else {
      notify("error", "Thread title and content cannot be empty");
    }
  };
  const handleOpenThread = (thread) => {
    setActiveThread(thread);
  };
  const closeModal = () => {
    setNewThreadModal(false);
    setNewThreadTitle("");
    setNewThreadText("");
  };
  const closeThreadView = () => {
    setActiveThread(null);
  };

  return (
    <div className="mt-24 text-white min-h-screen font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 md:px-8 py-10">
        {!activeThread ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between border-b-4 pb-4">
                  <h2 className="text-2xl font-bold pb-2">Featured Discussions</h2>
                  <button
                    className="bg-purple-600 text-white p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md"
                    onClick={handleNewThread}
                  >
                    + New Thread
                  </button>
                </div>
                <div className="space-y-6 pt-4">
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleOpenThread(thread)}
                    >
                      <div className="flex items-center">
                        <img
                          src={`https://via.placeholder.com/40?text=U${thread.id}`}
                          alt={`User Avatar ${thread.id}`}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-teal-400">{thread.title}</h3>
                          <p className="text-sm text-gray-400">Last activity: {thread.lastActivity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 border-b-4 pb-6">Trending Topics</h2>
                <ul className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <li
                        key={index}
                        className="p-3 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => notify("info", `Exploring Topic #${index + 1}`)}
                      >
                        <span className="text-teal-400">Topic #{index + 1}</span>
                      </li>
                    ))}
                </ul>
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4 border-b-4 pb-6">
                        Upcoming Community Events
                    </h2>
                    <div className="space-y-4">
                        {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <div
                            key={index}
                            className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                            <h3 className="text-lg font-semibold text-teal-400">
                                Event {index + 1}
                            </h3>
                            <p className="text-sm text-gray-400">
                                Date: {new Date().toLocaleDateString()}
                            </p>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4">{activeThread.title}</h2>
            <p className="mb-4 text-gray-400">{activeThread.text}</p>
            <button className="px-4 py-2 bg-purple-600 rounded-md" onClick={closeThreadView}>
              Back to Discussions
            </button>
          </div>
        )}
      </div>
      {newThreadModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-indigo-900 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Start a New Thread</h2>
            <input
              className="w-full p-3 bg-indigo-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 mb-4"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="Enter the Topic"
            />
            <textarea
              className="w-full p-3 bg-indigo-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 mb-4"
              rows="4"
              value={newThreadText}
              onChange={(e) => setNewThreadText(e.target.value)}
              placeholder="What's on your mind?"
            />
            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all" onClick={closeModal}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 rounded-md" onClick={handlePostThread}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Community;
