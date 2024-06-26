import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import SignInScreen from './Signin';
import DataDisplay from './Datadisplay';
import CombinedComponent from './Combined';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInScreen />} />
        <Route path="/:preferredName" element={<DataDisplay />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;