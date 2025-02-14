import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoHome, IoCameraOutline, IoCamera } from 'react-icons/io5';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { BiMoviePlay, BiSolidMoviePlay } from 'react-icons/bi';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        <button
          onClick={() => navigate('/screen3')}
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${isActive('/screen3') ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          {isActive('/screen3') ? <IoHome size={24} /> : <IoHomeOutline size={24} />}
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          onClick={() => navigate('/shorts')}
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${isActive('/shorts') ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          {isActive('/shorts') ? <BiSolidMoviePlay size={24} /> : <BiMoviePlay size={24} />}
          <span className="text-xs mt-1">Shorts</span>
        </button>

        <button
          onClick={() => navigate('/camera')}
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${isActive('/camera') ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          {isActive('/camera') ? <IoCamera size={24} /> : <IoCameraOutline size={24} />}
          <span className="text-xs mt-1">Camera</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${isActive('/profile') ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          {isActive('/profile') ? <FaUser size={24} /> : <FaRegUser size={24} />}
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;