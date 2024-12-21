import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Faqs from '../components/Faqs'
import Footer from '../components/Footer'

function Landing() {
  return (
    <>
        <Navbar />
        <Hero />
        <HowItWorks />
        <Features />
        <Faqs />
        <Footer />
    </>
  )
}

export default Landing