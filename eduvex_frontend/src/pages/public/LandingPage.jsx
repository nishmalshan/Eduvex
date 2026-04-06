import React from 'react'
import Navbar from '../../components/layout/Navbar'
import Header from '../../components/layout/Header'
import About from '../../components/public/About'
import CoursesSection from '../../components/public/CoursesSection'
import TrustBanner from '../../components/public/TrustBanner'
import Footer from '../../components/layout/Footer'
import CourseCategoryCards from '../../components/public/CourseCategoryCards'

const landingPage = () => {
  return (
    <div>
        <Navbar/>
        <Header/>
        <About/>
        <CoursesSection/>
        <TrustBanner/>
        <CourseCategoryCards/>
        <CoursesSection/>
        <Footer/>
    </div>
  )
}

export default landingPage