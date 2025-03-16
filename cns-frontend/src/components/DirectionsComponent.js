import { useEffect, useState } from "react";
import { DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const DirectionsComponent = ({ start, end }) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setResponse(result);
        }
      }
    );
  }, [start, end]);

  return response && <DirectionsRenderer directions={response} />;
};

export default DirectionsComponent;
