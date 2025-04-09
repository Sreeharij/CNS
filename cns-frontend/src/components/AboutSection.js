import React from "react";

const AboutSection = () => {
  const features = [
    {
      title: "Interactive Map",
      description: "Explore the campus with our interactive map featuring all important locations.",
      icon: "🗺️"
    },
    {
      title: "Real-time Navigation",
      description: "Get turn-by-turn directions to any building or facility on campus.",
      icon: "🧭"
    },
    {
      title: "Location Search",
      description: "Quickly find classrooms, labs, offices, and other facilities.",
      icon: "🔍"
    },
    {
      title: "Favorites",
      description: "Save your frequently visited places for quick access.",
      icon: "⭐"
    }
  ];

  return (
    <div id="about" className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nitc-darkBlue mb-4">About the Project</h2>
          <div className="w-24 h-1 bg-nitc-blue mx-auto mb-8 rounded-full"></div>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg">
            CNS (Campus Navigation System) is a smart web application designed to help students, faculty, and guests 
            find locations within NIT Calicut's vast campus. Leveraging Firebase for data storage and 
            Google Maps API for real-time location guidance, users can search, save favorite locations, 
            and explore the campus with confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-nitc-blue mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-nitc-darkBlue mb-4">Start Exploring NITC Today</h3>
          <p className="text-gray-600 mb-8">Join us in making campus navigation easier and more accessible for everyone</p>
          <button className="inline-flex items-center justify-center bg-nitc-blue hover:bg-nitc-darkBlue text-white px-8 py-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;