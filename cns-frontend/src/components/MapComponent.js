import React from "react";
import { GoogleMap, LoadScript, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import UserMarker from "./UserMarker";

//READHERE: I AM NOT USING USERMARKER INSTEAD USING DEFAULT MARKER JUST TO TEST
//READHERE: I AM TEMPORARILY SETTING MARADU AS CURRENT LOCATION JUST FOR TESTING
const mapContainerStyle = { width: "100%", height: "100vh" };

const defaultCenter = { lat: 9.936758602088782, lng:  76.3180385211476 }; 


const MapComponent = ({ userLocation, locations, directions }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GMAP_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation} zoom={16}>
        
        {/* User Location Marker */}
        {userLocation && <MarkerF position={userLocation} />}
        {console.log(`User Location Marker: ${userLocation.lat} ${userLocation.lng}`)}
        {/* Campus Locations */}
        {locations.map((loc, index) => (
          <MarkerF key={index} position={{ lat: loc.latitude, lng: loc.longitude }} />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}

      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
