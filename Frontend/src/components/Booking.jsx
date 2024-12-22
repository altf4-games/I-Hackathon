import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Booking = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Ensure searchResults is initialized as an array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // New state for the message
  const [chatResponse, setChatResponse] = useState(''); // New state for the chat response
  const [flights, setFlights] = useState([]); // State to store flight data

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BOM&destinationLocationCode=PNQ&departureDate=2024-12-25&adults=1');
        const data = await response.json();
        setFlights(data.data);
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    fetchFlights();
  }, []);

  const bookTicket = async (details, price) => {
    const data = {
      contractAddress: "0x56152b1325c3aA3A375A927788a2aBA5e3884319",
      to: "0x1346cc580Bffe1cB9948a056BDDCd893E6C5d5B6",
      travelType: "Flight",
      details: details,
      departureTime: 1834799787,
      validityPeriod: 86400,
      benefits: 42,
      tokenURI: "https://static.vecteezy.com/system/resources/thumbnails/002/212/836/small_2x/line-icon-for-tickets-vector.jpg",
      walletAddress: "0x1346cc580Bffe1cB9948a056BDDCd893E6C5d5B6",
      privateKey: "289fcc611a5782a0c8f0c475b3e3d46c7652ea845df842ef175b64fc3937cbc7",
      rpcUrl: "https://base-sepolia.g.alchemy.com/v2/6cIFot6NHvew0GwAL5PwYZxEQ1IhDgJP",
      value: "1000000000000000"
    };

    try {
      const response = await axios.post('https://web3-ticket-worker.arnabbhowmik019.workers.dev/book-ticket', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Ticket booked:', response.data);
    } catch (error) {
      console.error('Error booking ticket:', error);
    }
  };

  const searchFlights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://amadeus.arnabbhowmik019.workers.dev/api/search-flights', {
        params: {
          origin,
          destination,
          departureDate
        }
      });
      setSearchResults(response.data.data || []); // Ensure searchResults is set to an array
    } catch (error) {
      setError('Error fetching search results');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:9000/chat', { message });
      setChatResponse(response.data.response); // Assuming response.data.response is a string
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchFlights();
  };

  return (
    <>
      <div className="min-h-screen text-white font-sans relative py-20 text-center overflow-hidden">

        {/* Floating Interactive Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-br from-teal-400 to-purple-600 rounded-full blur-3xl opacity-50 animate-float" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full blur-2xl opacity-40 animate-float-reverse" />
        </div>

        {/* Main Section */}
        <main className="relative z-10 px-6 pt-12">
          <h2 className="text-5xl font-extrabold mb-8 text-center bg-clip-text animate-fade-in">
            Discover Boundless Horizons
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="bg-indigo-900 text-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto space-y-6 transform transition duration-500">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block font-semibold mb-2">From</label>
                <input
                  type="text"
                  className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 placeholder-indigo-300 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                  placeholder="City or Airport"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-2">To</label>
                <input
                  type="text"
                  className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 placeholder-indigo-300 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                  placeholder="City or Airport"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block font-semibold mb-2">Departure</label>
                <input
                  type="date"
                  className="w-full p-3 border border-teal-600 rounded-xl bg-gray-900 placeholder-indigo-300 text-indigo-100 focus:ring-4 focus:ring-purple-500"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-teal-400 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
              Search Flights
            </button>
          </form>

          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          

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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={sendMessage}
              className="w-full bg-gradient-to-r from-teal-400 to-purple-600 py-4 rounded-xl font-semibold text-xl hover:opacity-90 transform hover:scale-105 transition duration-500 hover:shadow-lg"
            >
              Send Message
            </button>
            {chatResponse && (
              <div className="mt-4 p-4 border border-teal-600 rounded-xl bg-gray-900 text-indigo-100">
                <h4 className="font-semibold mb-2">Response:</h4>
                <p>{chatResponse}</p>
              </div>
            )}
          </div>

          {/* Flight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition duration-500 relative hover:bg-opacity-90"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-50"></div>
                  <h3 className="font-bold text-2xl mb-4 text-teal-400 relative">Flight {flight.id}</h3>
                  <p className="relative text-gray-300">Departure: {flight.itineraries[0].segments[0].departure.iataCode}</p>
                  <p className="relative text-gray-300">Arrival: {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}</p>
                  <p className="relative mt-4 text-lg font-semibold text-teal-400">Price: {flight.price.total} {flight.price.currency}</p>
                  <button type="button" onClick={() => alert('Ticket booking successful')} className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-teal-400 py-3 rounded-xl font-semibold hover:opacity-90 transform hover:scale-105 transition duration-500">
                    Book Now
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-300">No flights available</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Booking;
