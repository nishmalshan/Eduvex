import React from 'react'
import Header from '../../../components/common/layout/Header'
import CoursesSection from '../../../components/student/sections/CoursesSection'
import CourseCategoryCards from '../../../components/student/sections/CourseCategoryCards'
import Footer from '../../../components/common/layout/Footer'
import BecomeTutorSection from '../../../components/student/home/BecomeTutorSection'
import HomeNavbar from '../../../components/common/layout/HomeNavbar'
import TopTutors from '../../../components/student/home/TopTutors'

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