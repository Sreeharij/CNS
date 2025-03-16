import { useState, useEffect } from "react";

const useUserLocation = () => {
  const [location, setLocation] = useState({ lat: 9.936758602088782, lng:  76.3180385211476 }); //Default to maradu

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          if (pos.coords.latitude && pos.coords.longitude) {
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return location;
};

export default useUserLocation;
