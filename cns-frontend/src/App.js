import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import UploadPage from './pages/UploadPage';
import IndexPage from './pages/IndexPage';
import Dashboard from './pages/Dashboard';
import Details from './pages/Details';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { createUserProfileIfNotExists } from './utils/createUserProfile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await createUserProfileIfNotExists(firebaseUser);
      }
      setUser(firebaseUser);
      setAuthChecked(true); // mark auth as completed
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // or your own spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage user={user} />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
