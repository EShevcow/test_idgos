import React from 'react';
//import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GreetingsPage from './Pages/GreetingsPage';

function App() {
  return (
  <Routes>
   <Route path='/' element={<GreetingsPage />} />
   <Route path='/s/:id' element={<GreetingsPage />} />
  </Routes>
  );
}

export default App;
