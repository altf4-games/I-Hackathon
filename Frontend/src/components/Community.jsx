import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Community = () => {
  const [newThreadModal, setNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadText, setNewThreadText] = useState("");
  const [threads, setThreads] = useState([
    { id: 1, title: "Thread Title 1", text: "Content of Thread 1", lastActivity: "2h ago" },
    { id: 2, title: "Thread Title 2", text: "Content of Thread 2", lastActivity: "5h ago" },
    { id: 3, title: "Thread Title 3", text: "Content of Thread 3", lastActivity: "1d ago" },
  ]);
  const [activeThread, setActiveThread] = useState(null); // For opening a thread

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

  const handleNewThread = () => setNewThreadModal(true);

  const handlePostThread = () => {
    if (newThreadText.trim() && newThreadTitle.trim()) {
      const newThread = {
        id: threads.length + 1,
        title: newThreadTitle,
        text: newThreadText,
        lastActivity: "Just now",
        replies: 0,
      };
      setThreads([newThread, ...threads]);
      notify("success", "Thread created!");
      setNewThreadTitle("");
      setNewThreadText("");
      setNewThreadModal(false);
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
              {/* Featured Discussions */}
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
                          <h3 className="text-lg font-semibold text-teal-400">
                            {thread.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Last activity: {thread.lastActivity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div>
                <h2 className="text-2xl font-bold mb-4 border-b-4 pb-6">
                  Trending Topics
                </h2>
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
            <button
              className="px-4 py-2 bg-purple-600 rounded-md"
              onClick={closeThreadView}
            >
              Back to Discussions
            </button>
          </div>
        )}
      </div>

      {/* New Thread Modal */}
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
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 rounded-md"
                onClick={handlePostThread}
              >
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
