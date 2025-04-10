import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const containerStyle = { width: '100vw', height: '100vh' };

function MapView() {
  const { locationId } = useParams();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY,
    libraries: ['places'],
  });

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [remainingDistance, setRemainingDistance] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const watchId = useRef(null);
  const mapRef = useRef(null);

  // 🔽 Fetch destination from Firestore
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const docRef = doc(db, 'locations', locationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDestination({
            name: data.name || "Unknown Destination",
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng)
          });
        } else {
          console.error("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchDestination();
  }, [locationId]);

  // 🔽 Track user's real-time location
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

  // 🔽 Generate route
  useEffect(() => {
    if (isLoaded && userLocation && destination) {
      calculateRoute();
    }
  }, [isLoaded, userLocation, destination]);

  async function calculateRoute() {
    if (!window.google || !userLocation || !destination) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: userLocation,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.WALKING,
      });

      const leg = results.routes[0].legs[0];
      setDirectionsResponse(results);
      setSteps(leg.steps);
      setCurrentStep(0);
      setRemainingDistance(leg.distance.text);
      setRemainingTime(leg.duration.text);

      const arrival = new Date();
      arrival.setMinutes(arrival.getMinutes() + leg.duration.value / 60);
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

  if (!isLoaded) return <div className="text-center text-lg p-4">Loading map...</div>;
  if (!destination) return <div className="text-center text-lg p-4">Loading destination...</div>;

  return (
    <div className="relative w-screen h-screen">
      <GoogleMap
        center={userLocation || { lat: destination.lat, lng: destination.lng }}
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
        <Marker position={{ lat: destination.lat, lng: destination.lng }} label="Destination" />
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      {/* Floating Turn-by-turn Info */}
      {isNavigating && currentStep !== null && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-lg text-center text-base md:text-lg z-10">
          <div className="font-semibold">{getTurnDirection(steps[currentStep])}</div>
          <div className="text-sm mt-1">
            📍 {remainingDistance} | ⏳ {remainingTime} | 🕒 ETA: {arrivalTime}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button onClick={startNavigation} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md">
          Start
        </button>
        <button onClick={stopNavigation} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md">
          Stop
        </button>
        <button onClick={recenterMap} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl shadow-md">
          Recenter
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-md z-10"
      >
        ← Back
      </button>
    </div>
  );
}

export default MapView;
