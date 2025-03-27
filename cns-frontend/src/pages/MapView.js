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
  const [currentStep, setCurrentStep] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [remainingDistance, setRemainingDistance] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const watchId = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          if (isNavigating) {
            updateNavigation(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      console.error("Geolocation is not supported");
    }

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [isNavigating]);

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
      setSteps(results.routes[0].legs[0].steps);
      setCurrentStep(0);
      setRemainingDistance(results.routes[0].legs[0].distance.text);
      setRemainingTime(results.routes[0].legs[0].duration.text);

      const arrival = new Date();
      arrival.setMinutes(arrival.getMinutes() + results.routes[0].legs[0].duration.value / 60);
      setArrivalTime(arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  }

  function startNavigation() {
    setIsNavigating(true);
  }

  function stopNavigation() {
    setIsNavigating(false);
    setDirectionsResponse(null);
    setCurrentStep(null);
    setRemainingDistance('');
    setRemainingTime('');
    setArrivalTime('');
  }

  function recenterMap() {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
    }
  }

  function updateNavigation(lat, lng) {
    if (!steps || steps.length === 0) return;

    const step = steps[currentStep];
    const nextStep = steps[currentStep + 1];

    if (nextStep) {
      const stepEnd = step.end_location;
      const distanceToNextTurn = getDistance(lat, lng, stepEnd.lat(), stepEnd.lng());

      if (distanceToNextTurn < 30) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function getTurnDirection(step) {
    if (!step) return "";

    const distance = step.distance.text;
    const maneuver = step.maneuver;

    let arrow = "⬆️";
    if (maneuver?.includes("left")) arrow = "⬅️";
    if (maneuver?.includes("right")) arrow = "➡️";

    return `${arrow} in ${distance}`;
  }

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <GoogleMap
        center={userLocation || { lat, lng }}
        zoom={16}
        mapContainerStyle={containerStyle}
        options={{
          zoomControl: false,
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

      {isNavigating && currentStep !== null && (
        <div style={{
          position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
          background: '#222', color: 'white', padding: '15px', borderRadius: '10px',
          boxShadow: '0px 2px 10px rgba(0,0,0,0.2)', textAlign: 'center', fontSize: '18px'
        }}>
          <div><strong>{getTurnDirection(steps[currentStep])}</strong></div>
          <div>📍 {remainingDistance} | ⏳ {remainingTime} | 🕒 ETA: {arrivalTime}</div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
        <button onClick={startNavigation} style={buttonStyle}>Start</button>
        <button onClick={stopNavigation} style={buttonStyle}>Stop</button>
        <button onClick={recenterMap} style={buttonStyle}>Recenter</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 15px',
  background: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  boxShadow: '0px 2px 10px rgba(0,0,0,0.3)',
  cursor: 'pointer'
};

export default MapView;
