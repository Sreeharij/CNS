import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LocationDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state?.location;

  if (!locationData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold">Location not found</h2>
          <button 
            className="mt-4 bg-nitc-blue hover:bg-nitc-darkBlue text-white px-4 py-2 rounded"
            onClick={() => navigate('/')}
          >
            Go back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Image header with back button */}
      <div className="relative h-72">
        <img 
          src={locationData.imageUrl} 
          alt={locationData.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button 
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
            onClick={() => navigate(-1)}
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30"
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Location details content */}
      <div className="flex-1 p-6 pb-20">
        <h1 className="text-3xl font-bold mb-4">{locationData.name}</h1>
        
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{locationData.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Floor</p>
              <p className="font-medium">{locationData.floor}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{locationData.type}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {locationData.description || 
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit."}
          </p>
        </div>
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-6 left-6 right-6">
        <button 
          className="w-full py-6 bg-nitc-blue hover:bg-nitc-darkBlue text-white rounded-xl shadow-lg"
        >
          Directions
        </button>
      </div>
    </div>
  );
};

export default LocationDetail;