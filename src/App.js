import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Homepage';
import Login from './LoginRegister/Login';
import Register from './LoginRegister/Register';
import myImage from './Images/Rectangle 1.png';
function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
