import React, { useEffect, useState, useRef } from 'react';
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
  const [steps, setSteps] = useState([]);
  const mapRef = useRef(null);

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
      setSteps(results.routes[0].legs[0].steps);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  }

  const recenterMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <GoogleMap
        center={userLocation || { lat, lng }}
        zoom={14}
        mapContainerStyle={containerStyle}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => (mapRef.current = map)}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {lat && lng && <Marker position={{ lat, lng }} label="Destination" />}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      <div style={{
        position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
        background: 'white', padding: '10px', borderRadius: '10px', boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
        width: '90%', maxWidth: '400px', textAlign: 'center'
      }}>
        <h3>{name}</h3>
        <p><strong>Distance:</strong> {distance} | <strong>Duration:</strong> {duration}</p>
        <button 
          onClick={() => setDirectionsResponse(null)} 
          style={{ padding: '8px 12px', margin: '5px', borderRadius: '5px', border: 'none', background: '#ff4d4d', color: 'white' }}
        >Clear Route</button>
        <button 
          onClick={recenterMap} 
          style={{ padding: '8px 12px', margin: '5px', borderRadius: '5px', border: 'none', background: '#4285F4', color: 'white' }}
        >Recenter</button>
      </div>

      {steps.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
          background: 'white', padding: '10px', borderRadius: '10px', boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
          width: '90%', maxWidth: '400px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto'
        }}>
          <h4>Turn-by-Turn Directions</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {steps.map((step, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <span dangerouslySetInnerHTML={{ __html: step.instructions }} />
                <small style={{ color: 'gray' }}> ({step.distance.text})</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapView;
