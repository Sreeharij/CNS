


import React, { useRef, useState } from "react";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";

const Index = () => {
  const aboutRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleScrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content section */}
      <main className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Hero Section */}
        <Hero onLearnMoreClick={handleScrollToAbout} />

        {/* Login Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-8">
          <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-nitc-darkBlue mb-2">Welcome to CNS</h2>
                <p className="text-gray-600">Choose an option to continue your journey</p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-nitc-blue hover:bg-nitc-darkBlue text-white py-3 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg"

                >
                  <span>Login with Credentials</span>
                </button>
                
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="w-full bg-nitc-green hover:bg-green-700 text-white py-3 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg"

                >
                  <span>Create New Account</span>
                </button>
                
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue as</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-200">
                  <span>Guest Explorer</span>
                </button>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>By continuing, you agree to our Terms and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <div ref={aboutRef}>
        <AboutSection />
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Campus Navigation System - NIT Calicut. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative animate-modal-appear">
            {/* Close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-center mb-6 text-nitc-darkBlue">Login to Your Account</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitc-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitc-blue"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-nitc-darkBlue to-nitc-blue text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
              <div className="text-right">
                <a href="#" className="text-sm text-nitc-blue hover:underline">
                  Forgot password?
                </a>
              </div>
              {/* Separator line */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>
              <button
                type="button"
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign in with Google
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative animate-modal-appear">
            {/* Close button */}
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-center mb-6 text-nitc-darkBlue">Create New Account</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nitc-green"
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="h-4 w-4 text-nitc-green focus:ring-nitc-green border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-nitc-green hover:underline">Terms and Conditions</a>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-nitc-green hover:bg-green-700 text-white py-3 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg"

              >
                Register
              </button>
              <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a 
                  href="#" 
                  className="text-nitc-blue hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                >
                  Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;