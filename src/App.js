import React from 'react';
import styles from './css/App.module.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Navbar} from './components/Navbar';
import {Home} from './components/Home'
import {Catalog} from './components/Catalog';
import {Listing} from './components/Listing';
import {Login} from './components/Login';
import {Signup} from './components/Signup';
import {Profile} from './components/Profile';
import {Cart} from './components/Cart';
import { Footer } from './components/Footer';
import { Checkout } from './components/Checkout';

function App() {
  return (
    <div className={styles.app_container}>
      <Router>
        <Navbar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
