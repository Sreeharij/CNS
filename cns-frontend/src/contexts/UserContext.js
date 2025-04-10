import { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(firestore, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      } else {
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (locationId) => {
    if (!user) return;
    const updatedFavorites = favorites.includes(locationId)
      ? favorites.filter((id) => id !== locationId)
      : [...favorites, locationId];

    setFavorites(updatedFavorites);

    const docRef = doc(firestore, 'users', user.uid);
    await updateDoc(docRef, { favorites: updatedFavorites });
  };

  return (
    <UserContext.Provider value={{ user, favorites, toggleFavorite, loading }}>
      {children}
    </UserContext.Provider>
  );
};
