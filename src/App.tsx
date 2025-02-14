/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import ShortsScreen from './screens/ShortsScreen';
import CameraScreen from './screens/CameraScreen';
import ProfileScreen from './screens/ProfileScreen';
import DatasetUploadScreen from './screens/DatasetUploadScreen';

import "./App.css"

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/screen3" element={<MainScreen />} />
        <Route path="/shorts" element={<ShortsScreen />} />
        <Route path="/camera" element={<CameraScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/datasets" element={<DatasetUploadScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
