import React, { useState, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import SearchBar from "../components/SearchBar";
import useUserLocation from "../hooks/useUserLocation";
import { fetchLocations } from "../services/locationService";

const Home = () => {
  const userLocation = useUserLocation();  // Live GPS tracking
  const [locations, setLocations] = useState([]); // Stores campus locations

  useEffect(() => {
    const getLocations = async () => {
      const data = await fetchLocations();
      setLocations(data);
    };
    getLocations();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Search Bar */}
      <SearchBar locations={locations} />

      {/* Google Map */}
      <MapComponent userLocation={userLocation} locations={locations} />
    </div>
  );
};

export default Home;
