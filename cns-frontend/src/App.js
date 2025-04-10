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

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-xl">Loading...</div>}>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<IndexPage user={user} />} />

          {/* Protected route: only accessible if user is logged in */}
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" replace />} />

          {/* Common pages */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/upload" element={<UploadPage />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
