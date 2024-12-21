import React from 'react';

const FlightBookingPage = () => {
    return (
        <>
            <div className="min-h-screen text-white font-sans relative py-20 text-center overflow-hidden">

                {/* Floating Interactive Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-br from-teal-400 to-purple-600 rounded-full blur-3xl opacity-50 animate-float" />
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-2xl opacity-40 animate-float-reverse" />
                </div>

                {/* Main Section */}
                <main className="relative z-10 px-6 pt-28">
                    <h2 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-600 animate-fade-in">
                        Discover Boundless Horizons
                    </h2>

                    {/* Search Form */}
                    <form className="bg-gray-800/80 text-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto space-y-6 transform transition duration-500 hover:scale-105 hover:shadow-purple-500/50">
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label className="block font-semibold mb-2">From</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 placeholder-indigo-300 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                                    placeholder="City or Airport"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold mb-2">To</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 placeholder-indigo-300 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                                    placeholder="City or Airport"
                                />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-1">
                                <label className="block font-semibold mb-2">Departure</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-semibold mb-2">Return</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-teal-400 to-purple-600 py-4 rounded-xl font-semibold text-xl hover:opacity-90 transform hover:scale-105 transition duration-500 hover:shadow-lg">
                            Search Flights
                        </button>
                    </form>

                    {/* Chat Widget */}
                    <div className="bg-gray-800/80 text-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto space-y-6 transform transition duration-500 hover:scale-105 hover:shadow-purple-500/50 mt-10">
                        <h3 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-600 animate-fade-in">
                            Chat with Us
                        </h3>
                        <div className="flex flex-col space-y-4">
                            <div className="flex-1">
                                <label className="block font-semibold mb-2">Message</label>
                                <textarea
                                    className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 placeholder-indigo-300 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                                    placeholder="Your Message"
                                    rows="4"
                                />
                            </div>
                        </div>
                        <button className="w-full bg-gradient-to-r from-teal-400 to-purple-600 py-4 rounded-xl font-semibold text-xl hover:opacity-90 transform hover:scale-105 transition duration-500 hover:shadow-lg">
                            Send Message
                        </button>
                    </div>

                    {/* Flight Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {[1, 2, 3].map((flight) => (
                            <div
                                key={flight}
                                className="bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition duration-500 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-50"></div>
                                <h3 className="font-bold text-2xl mb-4 text-teal-400 relative">Flight {flight}</h3>
                                <p className="relative text-gray-300">Departure: City A</p>
                                <p className="relative text-gray-300">Arrival: City B</p>
                                <p className="relative mt-4 text-lg font-semibold text-teal-400">Price: $300</p>
                                <button className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-teal-400 py-3 rounded-xl font-semibold hover:opacity-90 transform hover:scale-105 transition duration-500">
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </main>

            </div>
        </>
    );
};

export default FlightBookingPage;
