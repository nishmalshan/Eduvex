import React from 'react'
import Header from '../../../components/common/layout/Header'
import CoursesSection from '../../../components/user/sections/CoursesSection'
import CourseCategoryCards from '../../../components/user/sections/CourseCategoryCards'
import Footer from '../../../components/common/layout/Footer'
import BecomeTutorSection from '../../../components/user/home/BecomeTutorSection'
import HomeNavbar from '../../../components/common/layout/HomeNavbar'
import TopTutors from '../../../components/user/home/TopTutors'

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