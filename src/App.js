import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './App.css';

function App() {

  return (
    <>
      <Navbar>
        {<Router>
          <Routes>
            <Route path='/' element={Home}></Route>
          </Routes>
        </Router>}
      </Navbar>
    </>
  );
}

export default App;
