import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import RewardPage from './pages/RewardPage'
import ProfilePage from './pages/ProfilePage'
import MarketPlacePage from './pages/MarketPlacePage'
import CommunityPage from './pages/CommunityPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/signup" element={<h1>Signup</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/booking" element={<h1>Booking</h1>} />
        <Route path="/marketplace" element={<MarketPlacePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/rewards" element={<RewardPage />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}