import React from "react";
import { Marker } from "@react-google-maps/api";

const UserMarker = ({ position }) => {
  return position ? (
    <Marker position={position} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
  ) : null;
};

export default UserMarker;
