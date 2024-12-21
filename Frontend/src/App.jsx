import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UserProfile from './components/Profile'
import MarketPlace from './components/MarketPlace'
import Rewards from './components/Rewards'
import Community from './components/Community'
import Booking from './components/Booking'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import FAQ from './components/Faqs'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <HowItWorks />
            <Features />
            <FAQ />
          </>
        } />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/community" element={<Community />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}