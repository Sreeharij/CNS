import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import "./App.css";

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const MapView = lazy(() => import('./pages/MapView'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const IndexPage = lazy(() => import('./pages/IndexPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Details = lazy(() => import('./pages/Details'));

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // 🔥 Add this

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true); // ✅ Auth status has been determined
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-xl">Loading...</div>}>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<IndexPage user={user} />} />

          {/* Protected route */}
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" replace />} />

          {/* Common pages */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/details/:locationId" element={<Details />} />
          <Route path="/map/:locationId" element={<MapView />} />
          <Route path="/upload" element={<UploadPage />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
