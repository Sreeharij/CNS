import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './components/Auth';
import MapView from './pages/MapView';
import UploadPage from './pages/UploadPage';
import Login from './pages/Login';
import './App.css';
import Dashboard from './pages/Dashboard';
import Details from './pages/Details';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="text-3xl font-bold text-blue-600"></div>
      <Auth setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <p>Please log in to view history.</p>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
