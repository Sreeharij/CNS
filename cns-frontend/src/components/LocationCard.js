import React from "react";
import "../styles/LocationCard.css"; // Import CSS for styling

const LocationCard = ({ location,onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={location.imageUrl} alt={location.name} className="card-image" />
      <div className="card-content">
        <h3>{location.name}</h3>
        <p><strong>Department:</strong> {location.department}</p>
        <p><strong>Floor:</strong> {location.floor}</p>
        <p className="description">{location.description}</p>
      </div>
    </div>
  );
};

export default LocationCard;
