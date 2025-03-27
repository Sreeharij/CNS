import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './pages/Navigation';
import Profile from './pages/Profile';
import Auth from './components/Auth';
import MapView from './pages/MapView';
import UploadPage from './pages/UploadPage';
// import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Auth setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navigate" element={<Navigation user={user} />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <p>Please log in to view history.</p>} />
        <Route path="/map" element={<MapView />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
