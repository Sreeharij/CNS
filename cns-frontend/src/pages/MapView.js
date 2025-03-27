import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = { width: '100vw', height: '100vh' };

function MapView() {
  const location = useLocation();
  const destination = location.state || {}; 

  const lat = destination?.lat ? parseFloat(destination.lat) : null;
  const lng = destination?.lng ? parseFloat(destination.lng) : null;
  const name = destination?.name || "Unknown Destination";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY,
    libraries: ['places'],
  });

  const [userLocation, setUserLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      console.error("Geolocation is not supported");
    }
  }, []);

  useEffect(() => {
    if (isLoaded && userLocation && lat !== null && lng !== null) {
      calculateRoute();
    }
  }, [isLoaded, userLocation, lat, lng]);

  async function calculateRoute() {
    if (!window.google || !userLocation) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: userLocation,
        destination: { lat, lng },
        travelMode: window.google.maps.TravelMode.WALKING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  }

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <GoogleMap
        center={userLocation || { lat, lng }}
        zoom={14}
        mapContainerStyle={containerStyle}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {lat && lng && <Marker position={{ lat, lng }} label="Destination" />}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      <div style={{
        position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
        background: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
      }}>
        <strong>Destination:</strong> {name}<br />
        <button onClick={() => setDirectionsResponse(null)} style={{ marginTop: '5px', padding: '5px 10px' }}>Clear Route</button>
        <div style={{ marginTop: '10px' }}>
          <strong>Distance:</strong> {distance} | <strong>Duration:</strong> {duration}
        </div>
      </div>
    </div>
  );
}

export default MapView;
