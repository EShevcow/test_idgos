import React from 'react';
//import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GreetingsPage from './Pages/GreetingsPage';
import ViewPage from './Pages/ViewPage';
import GetEsiaData from './Pages/GetEsiaData';

function App() {
  return (
  <Routes>
   <Route path='/' element={<GreetingsPage />} />
   <Route path='/s/:id' element={<GreetingsPage />} />
   <Route path='/view' element={<ViewPage />} />
   <Route path='/esia' element={<GetEsiaData />} />
  </Routes>
  );
}

export default App;
