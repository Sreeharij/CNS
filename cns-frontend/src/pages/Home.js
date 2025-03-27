import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import LocationCard from "../components/LocationCard";
import "../styles/Home.css";

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "locations"));
        const locationsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const location = doc.data();
            const imageUrl = await getDownloadURL(ref(storage, location.imagePath));
            return { id: doc.id, ...location, imageUrl };
          })
        );
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleCardClick = (location) => {
    navigate("/map", { state: location }); // ✅ Pass entire location object in state
  };

  return (
    <div className="home-container">
      <h2>Campus Locations</h2>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="grid-container">
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onClick={() => handleCardClick(location)} // Pass full location object
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
