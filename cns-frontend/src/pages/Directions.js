import { useState, useEffect, useMemo } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, MarkerF } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import useUserLocation from "../hooks/useUserLocation";

const Directions = () => {
  const userLocation = useUserLocation();
  const searchParams = new URLSearchParams(useLocation().search);
  
  // ✅ Ensure lat/lng are valid numbers
  const destination = useMemo(() => {
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    console.log(`Directions.js Latitude: ${lat} Lng: ${lng}`);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid destination coordinates");
      return null;
    }

    return { lat, lng, name: searchParams.get("name") || "Unknown Location" };
  }, [searchParams]);

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!userLocation || !destination || !window.google) return; // ✅ Prevent running with invalid data

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed due to: " + status);
        }
      }
    );
  }, [userLocation, destination]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GMAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        zoom={15}
        center={userLocation || destination || { lat: 9.936758602088782, lng:  76.3180385211476 }}
      >
        {/* ✅ Use AdvancedMarkerElement for user location */}
        {userLocation && (
          <MarkerF position={userLocation}>
            <div style={{ backgroundColor: "blue", padding: "10px", borderRadius: "50%", color: "white" }}>
              📍 You
            </div>
          </MarkerF>
        )}

        {/* ✅ Use AdvancedMarkerElement for destination */}
        {destination && (
          <MarkerF position={destination}>
            <div style={{ backgroundColor: "red", padding: "10px", borderRadius: "50%", color: "white" }}>
              📍 {destination.name}
            </div>
          </MarkerF>
        )}

        {/* ✅ Show Directions */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default Directions;
