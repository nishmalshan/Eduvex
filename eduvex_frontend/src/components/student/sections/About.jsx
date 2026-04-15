import React from 'react'
import aboutImage from "../../../assets/images/Group292.png"
import aboutImage2 from "../../../assets/images/Group22.png"


const About = () => {
  return (
    <div>
        {/* About section */}
    <section className="py-16 md:py-24 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          
          {/* Left Side - Image */}
          <div className="w-full md:w-1/2">
            <img
              src={aboutImage}
              alt="AI Learning"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Prepare Your Career for the{' '}
              <span className="text-blue-600">Age of AI</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Stay ahead with personalized learning paths and up-to-date content created by industry professionals.
            </p>
          </div>

        </div>
      </div>
    </section>



    {/* About section -2 */}
    <section className="py-16 md:py-16 bg-white px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-900 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 mx-8">
          
          {/* Left Side - Image */}
          <div className="w-full md:w-2/5">
            <h2 className="font-source italic text-3xl sm:text-4xl lg:text-4xl font-normal text-white leading-tight mb-6">
              Build Practical <span className='font-source not-italic font-bold'>Skills</span> for Real-World <span className='font-source not-italic font-bold'>Success</span>
            </h2>

            <p className="text-lg text-white leading-relaxed">
              Stay ahead with personalized learning paths and up-to-date content created by industry professionals.
            </p>
          </div>

          {/* Right Side - Content */}
          <div className="w-full md:w-3/5">
            <img
              src={aboutImage2}
              alt="AI Learning"
              className="w-full h-auto object-cover my-8 float-right w-[90%]"
            />
          </div>

        </div>
      </div>
    </section>
    </div>
  )
}

export default About