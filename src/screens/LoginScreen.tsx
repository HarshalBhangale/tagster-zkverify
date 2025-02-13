/* eslint-disable jsx-a11y/alt-text */
"use client";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'react-toastify';
import { FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface VideoCardProps {
  src: string;
  title: string;
  style: React.CSSProperties;
}

function VideoCard({ src, title, style }: VideoCardProps) {
  return (
    <div
      className="absolute w-[80%] max-w-[220px] aspect-[9/16] transition-all duration-300 hover:z-50 hover:scale-105"
      style={{
        ...style,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          src={src}
          aria-label={`Video: ${title}`}
        />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm font-semibold">{title}</p>
        </div>
      </div>
    </div>
  );
}

const LoginScreen = () => {
  const navigate = useNavigate();
  const { login, ready, authenticated } = usePrivy();

  React.useEffect(() => {
    if (ready && authenticated) {
      toast.success('Successfully authenticated! Redirecting...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate('/screen3'), 1000);
    }
  }, [ready, authenticated, navigate]);

  const handleLogin = async () => {
    try {
      toast.info('Connecting wallet...', {
        position: "top-right",
        autoClose: 2000,
      });
      await login();
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCompanyAccess = () => {
    navigate('/datasets');
    toast.info('Welcome to the Dataset Management Portal', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <section className="flex flex-col pt-32 pb-0 relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Neural network animation background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_100%)]"></div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 min-w-1/2 p-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 inline-flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm">AI Training Platform</span>
          </div>

          <h1 className="text-left tracking-tight text-white text-4xl md:text-4xl lg:text-6xl font-bold max-w-6xl mt-6 relative z-10">
            Train AI Models with
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Human Intelligence
            </span>
          </h1>

          <h2 className="my-6 text-white/80 font-normal text-left text-base md:text-xl max-w-3xl relative z-10">
            Join our platform to help train and improve AI models through human feedback. 
            Earn rewards while contributing to the future of artificial intelligence.
          </h2>

          <div className="flex flex-wrap items-center gap-4 my-8">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Data Annotation</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Model Training</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Reward System</span>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-start my-10 relative z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Connect Wallet
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompanyAccess}
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <FaBuilding className="mr-2" />
              Company Access
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 min-w-1/2 h-[600px] flex items-center justify-center">
          <VideoCard
            src="https://strshrt.xyz/cleopatre.mp4"
            title="The Cleopatre Effect"
            style={{
              transform: 'rotate(0deg) translateX(-200px)',
              zIndex: 3,
            }}
          />
          <VideoCard
            src="https://strshrt.xyz/everest.mp4"
            title="The saddest story on Everest"
            style={{
              transform: 'rotate(10deg) translateX(0px)',
              zIndex: 2,
            }}
          />
          <VideoCard
            src="https://strshrt.xyz/apollo.mp4"
            title="The day Apollo 11 landed on the moon"
            style={{
              transform: 'rotate(20deg) translateX(200px)',
              zIndex: 1,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default LoginScreen;