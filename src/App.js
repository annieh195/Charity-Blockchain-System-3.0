import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/js/Login';
import Register from './pages/js/Register';
import Home from './pages/js/Home';
import CreatePage from './pages/js/CreatePage';
import DonationPage from './pages/js/DonationPage';
import PersonalProfile from './pages/js/PersonalProfile';
import NavBar from './pages/js/NavBar';
import Logout from './pages/js/Logout';
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <ChakraProvider>
      <Router>
        {isLoggedIn && <NavBar onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" />} />
          <Route path="/donation/:charityName" element={isLoggedIn ? <DonationPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <PersonalProfile /> : <Navigate to="/login" />} /> {/* Added this line */}
          <Route path="/logout" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
