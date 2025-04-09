


import React from "react";

const Hero = ({ onLearnMoreClick }) => {
  return (
    <div className="w-full md:w-1/2 bg-gradient-nitc flex flex-col items-center justify-center text-center p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-0"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 animate-gradient-shift z-0"></div>
      
      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-200 opacity-20 animate-float-slow"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-blue-300 opacity-20 animate-float-delay"></div>
      <div className="absolute top-1/4 right-16 w-16 h-16 rounded-full bg-green-200 opacity-20 animate-pulse-light"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with animation */}
        <div className="rounded-full bg-white p-4 shadow-lg mb-8 animate-float">
          <img
            src="https://imgs.search.brave.com/RPdZ2-4GnKmLvbB06Y_etdHHL3NacXZFtYTRm3CloW8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hYnBl/ZC1jb2xsZWdlLWRh/c2hib2FyZC5zMy51/cy1lYXN0LTIuYW1h/em9uYXdzLmNvbS90/dGVkL2NvbGxlZ2Ut/YmFja2VuZC9jb2xs/ZWdlL2RmNGE2ZjVl/LWE5MTYtNGM5Ny04/NTE3LTVhMzQ1NzM4/YTU2MC5wbmc"
            alt="NITC Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
        
        {/* Title with gradient text */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-nitc-darkBlue to-nitc-blue bg-clip-text text-transparent drop-shadow-sm">
          Campus Navigation System
        </h1>
        
        {/* Subtitle with shadow */}
        <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-md leading-relaxed drop-shadow-sm">
          Your ultimate guide to explore and navigate the NIT Calicut campus with ease and confidence.
        </p>
        
        {/* CTA Button with animation */}
        <button
          onClick={onLearnMoreClick}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-nitc-darkBlue to-nitc-blue px-8 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Learn More
            {/* Custom arrow down icon */}
            <svg 
              className="w-4 h-4 animate-bounce" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </span>
          <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
