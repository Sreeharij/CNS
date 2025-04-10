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

  if (!isLoaded) return <div className="text-center mt-10">Loading map...</div>;
  if (!destination) return <div className="text-center mt-10">Loading destination...</div>;

  return (
    <div className="relative w-screen h-screen">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-10 bg-white shadow-md flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-semibold text-lg">
          ← Back
        </button>
        <h2 className="text-center font-bold text-lg text-gray-800 truncate">{destination.name}</h2>
        <div className="w-16" /> {/* spacer to balance layout */}
      </div>

      {/* Map */}
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
        <Marker position={{ lat: destination.lat, lng: destination.lng }} label="Dest" />
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>

      {/* Navigation Info Box */}
      {isNavigating && currentStep !== null && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-3 rounded-xl shadow-lg text-center text-sm z-10">
          <div className="font-semibold text-lg">{getTurnDirection(steps[currentStep])}</div>
          <div className="mt-1">📍 {remainingDistance} | ⏳ {remainingTime} | 🕒 ETA: {arrivalTime}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button onClick={startNavigation} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">Start</button>
        <button onClick={stopNavigation} className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700">Stop</button>
        <button onClick={recenterMap} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">Recenter</button>
      </div>
    </div>
  );
}

export default MapView;
