import React from 'react'
import Navbar from '../../../components/common/layout/Navbar'
import Header from '../../../components/common/layout/Header'
import About from '../../../components/student/sections/About'
import CoursesSection from '../../../components/student/sections/CoursesSection'
import TrustBanner from '../../../components/student/sections/TrustBanner'
import Footer from '../../../components/common/layout/Footer'
import CourseCategoryCards from '../../../components/student/sections/CourseCategoryCards'

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