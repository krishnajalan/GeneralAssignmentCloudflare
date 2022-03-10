import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';

const App = () => {
  
  return (
    <Router>
      
      <Container maxWidth="lg">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
