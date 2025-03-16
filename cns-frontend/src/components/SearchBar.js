import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ locations }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleLocationClick = (location) => {
    navigate(`/directions?lat=${location.latitude}&lng=${location.longitude}&name=${location.name}`);
  };

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 bg-white shadow-md">
      <input
        type="text"
        placeholder="Search campus locations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      {/* Display filtered locations */}
      {query && (
        <div className="mt-2 bg-gray-100 p-2 rounded shadow-md">
          {filteredLocations.map((loc, index) => (
            <div key={index} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleLocationClick(loc)}>
              {loc.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
