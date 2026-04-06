import React from 'react'
import Header from '../../components/layout/Header'
import CoursesSection from '../../components/public/CoursesSection'
import CourseCategoryCards from '../../components/public/CourseCategoryCards'
import Footer from '../../components/layout/Footer'
import BecomeTutorSection from '../../components/home/BecomeTutorSection'
import HomeNavbar from '../../components/layout/HomeNavbar'
import TopTutors from '../../components/home/TopTutors'

const HomePage = () => {
  return (
    <div>
        <HomeNavbar/>
        <Header/>
        <CoursesSection/>
        <CourseCategoryCards/>
        <CoursesSection/>
        <BecomeTutorSection/>
        <TopTutors/>
        <Footer/>
    </div>
  )
}

export default HomePage