import React from 'react'


const companies = [
  { id: 1, name: "Samsung" },
  { id: 2, name: "Vimeo" },
  { id: 3, name: "Volkswagen" },
  { id: 4, name: "Ericsson" },
  { id: 5, name: "Citi" },
  { id: 6, name: "Cisco" },
  { id: 7, name: "Google" },
];

const CompanyLogo = ({ name }) => (
  <div className="flex-shrink-0 flex items-center justify-center w-36 h-16 mx-6">
    {/* Replace this div with your actual logo image or SVG */}
    <div className="w-full h-full flex items-center justify-center rounded-md bg-gray-100 border border-gray-200">
      <span className="text-gray-500 font-semibold text-sm tracking-wide">
        {name}
      </span>
    </div>
  </div>
);

const TrustBanner = () => {
  return (
    <section className="bg-gray-50 py-10 px-4">
      {/* Heading */}
      <p className="text-center text-gray-500 text-sm mb-8">
        Trusted by over 17,000 companies and millions of learners around the world
      </p>

      {/* Desktop: centered flex row */}
      <div className="hidden md:flex items-center justify-center flex-wrap gap-6">
        {companies.map((company) => (
          <CompanyLogo key={company.id} name={company.name} />
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center w-max px-4">
          {companies.map((company) => (
            <CompanyLogo key={company.id} name={company.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBanner