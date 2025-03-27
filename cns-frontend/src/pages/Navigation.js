import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { saveRoute } from '../firebase/firestore';
import '../styles/App.css';

const center = { lat: 48.8584, lng: 2.2945 };

function Navigation({ user }) {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  async function calculateRoute() {
    if (!originRef.current.value || !destinationRef.current.value) return;

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.WALKING,
    });

    setDirections(results);

    if (user) {
      await saveRoute(user.uid, originRef.current.value, destinationRef.current.value);
    }
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GMAP_API_KEY} libraries={['places']}>
      <div className="navigation">
        <GoogleMap center={center} zoom={15} mapContainerClassName="map" onLoad={map => setMap(map)} />
        <div className="controls">
          <Autocomplete>
            <input type="text" placeholder="Origin" ref={originRef} />
          </Autocomplete>
          <Autocomplete>
            <input type="text" placeholder="Destination" ref={destinationRef} />
          </Autocomplete>
          <button onClick={calculateRoute}>Get Directions</button>
        </div>
        {directions && <DirectionsRenderer directions={directions} />}
      </div>
    </LoadScript>
  );
}

export default Navigation;
