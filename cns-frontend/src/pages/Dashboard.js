import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../firebase/config";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { signOut } from "firebase/auth";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userFavorites, setUserFavorites] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = ["All", "Recreational", "Event & Seminar Venues", "Facilities", "Administrative Buildings", "Career & Development Centers"];

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "");
            setUserFavorites(userData.favorites || []);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserName("Guest");
        setUserFavorites([]);
      }
    };

    fetchUserName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCardClick = (location) => {
    navigate(`/details/${location.id}`, { state: { location } });
  };

  const toggleFavorite = async (locationId) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const isFavorited = userFavorites.includes(locationId);

    try {
      await updateDoc(userRef, {
        favorites: isFavorited ? arrayRemove(locationId) : arrayUnion(locationId),
      });

      // Update local state
      setUserFavorites((prevFavorites) =>
        isFavorited
          ? prevFavorites.filter((id) => id !== locationId)
          : [...prevFavorites, locationId]
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "locations"));
        const locationsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const location = doc.data();
            const imageUrl = await getDownloadURL(ref(storage, location.imagePath));
            return { id: doc.id, ...location, imageUrl };
          })
        );
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(
    (location) =>
      (activeCategory === "All" || location.type === activeCategory) &&
      (searchTerm === "" || location.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-semibold text-nitc-darkBlue mb-4">
              Welcome, {userName} 👋
            </div>
            <div className="flex items-center text-nitc-blue gap-1 text-sm">
              <span>Location:</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>National Institute Of Technology Calicut</span>
            </div>
          </div>

          {/* Profile and Logout buttons */}
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 text-white bg-nitc-blue rounded-md hover:bg-nitc-darkBlue"
              >
                Profile
              </button>
            )}
            <button
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            className="pl-10 pr-10 py-2 w-full rounded-full border border-gray-200"
            placeholder="Search by name, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="flex space-x-2 w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-6 py-2 ${
                  activeCategory === category
                    ? "bg-nitc-blue text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4 uppercase">{activeCategory}</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleCardClick(location)}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 relative">
                  {/* Favorite star icon */}
                  { user && (
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(location.id);
                    }}
                    className={`absolute top-2 right-2 text-yellow-400 hover:scale-110 transition-transform text-2xl drop-shadow ${
                      userFavorites.includes(location.id) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    title="Add to favorites"
                  >
                    {userFavorites.includes(location.id) ? "⭐" : "☆"}
                  </button>
                  )}

                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span> {location.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Floor:</span> {location.floor}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {location.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLocations.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No locations found for this category
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
