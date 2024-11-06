import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './components/Home'
import Catalog from './components/Catalog';
import {Listing} from './components/Listing';
import Profile from './components/Profile';
import {Signup} from './components/Signup';
import {Login} from './components/Login';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;