import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import RewardPage from './pages/RewardPage'
import ProfilePage from './pages/ProfilePage'
import MarketPlacePage from './pages/MarketPlacePage'
import CommunityPage from './pages/CommunityPage'
import FlightBookingPage from './pages/FlightBookingPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/booking" element={<h1>Booking</h1>} />
        <Route path="/marketplace" element={<MarketPlacePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/rewards" element={<RewardPage />} />
        <Route path="/booking/flight" element={<FlightBookingPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}