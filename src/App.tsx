/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { PrivyProvider } from '@privy-io/react-auth';
import LoginScreen from './screens/LoginScreen';
import CatConfirmationScreen from './screens/MainScreen';
import ShortsScreen from './screens/ShortsScreen';
import CameraScreen from './screens/CameraScreen';
import ProfileScreen from './screens/ProfileScreen';

import "./App.css"

const CLIENT_ID = "cm6owh66s002rlwuef0fvk51c";

const App = () => {
  return (

      <PrivyProvider
        appId={CLIENT_ID}
        config={{
          loginMethods: ['email', 'google'],
          appearance: {
            theme: 'dark',
            accentColor: '#676FFF',
            showWalletLoginFirst: false,
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/screen3" element={<CatConfirmationScreen />} />
            <Route path="/shorts" element={<ShortsScreen />} />
            <Route path="/camera" element={<CameraScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </Router>
      </PrivyProvider>

  );
};

export default App;
