import React from 'react'
import Navbar from '../../../components/common/layout/Navbar'
import Header from '../../../components/common/layout/Header'
import About from '../../../components/user/sections/About'
import CoursesSection from '../../../components/user/sections/CoursesSection'
import TrustBanner from '../../../components/user/sections/TrustBanner'
import Footer from '../../../components/common/layout/Footer'
import CourseCategoryCards from '../../../components/user/sections/CourseCategoryCards'

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