import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { signOut } from "firebase/auth";  // Import the signOut method from Firebase Auth
import { auth } from "../firebase/config";  // Import auth to handle sign out

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);

          if (data.favorites && data.favorites.length > 0) {
            const favoriteData = await Promise.all(
              data.favorites.map(async (locationId) => {
                const locDoc = await getDoc(doc(db, "locations", locationId));
                if (locDoc.exists()) {
                  const location = locDoc.data();
                  const imageUrl = await getDownloadURL(
                    ref(storage, location.imagePath)
                  );
                  return { id: locationId, ...location, imageUrl };
                }
                return null;
              })
            );
            setFavoriteLocations(favoriteData.filter(Boolean));
          }
        }
      } catch (error) {
        console.error("Error fetching profile or favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const removeFromFavorites = async (locationId) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedFavorites = userData.favorites.filter((id) => id !== locationId);

      await updateDoc(userRef, { favorites: updatedFavorites });

      setFavoriteLocations((prev) =>
        prev.filter((location) => location.id !== locationId)
      );
      setUserData((prev) => ({ ...prev, favorites: updatedFavorites }));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Sign out the user
      navigate("/");  // Redirect to home page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);  // Go back to the previous page
  };

  const handleLocationClick = (locationId) => {
    navigate(`/details/${locationId}`);  // Navigate to location details page
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
  }

  if (!userData) {
    return <div className="p-6 text-center text-red-500">User data not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between mb-6">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="px-4 py-2 text-white bg-nitc-blue rounded-md hover:bg-nitc-darkBlue"
          >
            &#8592; Back
          </button>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-bold text-nitc-darkBlue mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Name</p>
            <p className="text-gray-900">{userData.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Email</p>
            <p className="text-gray-900">{userData.email}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 text-nitc-blue">⭐ Favorite Locations</h3>
        {favoriteLocations.length === 0 ? (
          <p className="text-gray-500">No favorite locations added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer"
                onClick={() => handleLocationClick(location.id)}  // Navigate to details on click
              >
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 relative">
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">
                    {location.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span> {location.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Floor:</span> {location.floor}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {location.description}
                  </p>
                  <button
                    onClick={() => removeFromFavorites(location.id)}
                    className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500"
                    title="Remove from Favorites"
                  >
                    {/* <Star fill="currentColor" size={26} /> */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
