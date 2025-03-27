import React, { useEffect, useState } from "react";
import { getUserRoutes } from "../firebase/firestore";

function Profile({ user }) {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (user) {
      getUserRoutes(user.uid).then(setRoutes);
    }
  }, [user]);

  return (
    <div>
      <h2>Navigation History</h2>
      <ul>
        {routes.map((route, index) => (
          <li key={index}>
            {route.origin} → {route.destination} ({new Date(route.timestamp.seconds * 1000).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
