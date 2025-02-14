import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { IoStatsChart, IoTrendingUp, IoTime, IoCheckmarkDone, IoWallet } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

const TAGSTER_CONTRACT_ADDRESS = "0xA0831793F9Dd3B6E9449FA40227F73fF71bBb4De"; // Replace with your deployed contract address
const TAGSTER_ABI = [
  "function mintNFT(address recipient, string memory tokenURI) external",
  "function maxSupply() public view returns (uint256)",
  "function burnNFT(uint256 tokenId) external"
];

const ProfileScreen = () => {
  const [selectedTab, setSelectedTab] = useState('stats');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const { user, authenticated } = usePrivy();

  const handleMintNFT = async () => {
    try {
      setIsMinting(true);
      if (!authenticated || !user?.wallet?.address) {
        toast.error("Please connect your wallet first");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(TAGSTER_CONTRACT_ADDRESS, TAGSTER_ABI, signer);

      // Replace with your IPFS metadata URI
      const tokenURI = "ipfs://YOUR_METADATA_URI";
      
      const tx = await contract.mintNFT(user.wallet.address, tokenURI);
      await tx.wait();
      
      toast.success("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleClaimRewards = () => {
    toast.success("Rewards claimed successfully!");
  };

  // Mock data - replace with real data from your backend
  const userStats = {
    imagesTagged: 1234,
    videosWatched: 89,
    accuracyRate: 95,
    earnings: 2500,
    tasksCompleted: 156,
    rank: 'Expert Annotator',
    level: 8,
    xp: 7800,
    nextLevelXp: 10000,
    weeklyEarnings: 125.50,
    monthlyEarnings: 486.75,
    recentActivities: [
      { type: 'image', count: 25, time: '2 hours ago', reward: 12.5 },
      { type: 'video', count: 15, time: '4 hours ago', reward: 7.5 },
      { type: 'image', count: 30, time: '1 day ago', reward: 15.0 },
      { type: 'video', count: 20, time: '2 days ago', reward: 10.0 },
    ]
  };

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: IoStatsChart },
    { id: 'earnings', label: 'Earnings', icon: IoWallet },
    { id: 'activities', label: 'Activities', icon: IoTime },
  ];

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const userInitials = 'AI';
  const userEmail = 'user@example.com';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMintNFT}
                disabled={isMinting || !authenticated}
                className={`px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-400 font-medium hover:from-purple-500/30 hover:to-pink-600/30 transition-all duration-300 border border-purple-500/20 shadow-lg shadow-purple-500/10 ${
                  isMinting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isMinting ? 'Minting...' : 'Mint OG NFT'}
              </button>
              <button
                onClick={handleClaimRewards}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 font-medium hover:from-emerald-500/30 hover:to-teal-600/30 transition-all duration-300 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
              >
                Claim Rewards
              </button>
              {isLoggedIn && (
                <button
                  onClick={toggleLogin}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 font-medium hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 border border-red-500/20 shadow-lg shadow-red-500/10"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/10 shadow-lg shadow-purple-500/10' 
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${selectedTab === tab.id ? 'text-blue-400' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 p-4">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userInitials}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{userStats.rank}</h2>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-gray-400 text-sm">
                    {userEmail}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                    Level {userStats.level}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
                    {userStats.xp} XP
                  </div>
                </div>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Level Progress</span>
                <span>{Math.round((userStats.xp / userStats.nextLevelXp) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <IoCheckmarkDone className="text-blue-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Images Tagged</p>
                <p className="text-2xl font-bold text-white">{userStats.imagesTagged}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <IoTime className="text-purple-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Videos Watched</p>
                <p className="text-2xl font-bold text-white">{userStats.videosWatched}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <IoTrendingUp className="text-green-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Accuracy Rate</p>
                <p className="text-2xl font-bold text-white">{userStats.accuracyRate}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <IoWallet className="text-yellow-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-white">{userStats.earnings}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {userStats.recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'image' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                  }`}>
                    {activity.type === 'image' ? (
                      <IoCheckmarkDone className={`w-5 h-5 ${
                        activity.type === 'image' ? 'text-blue-500' : 'text-purple-500'
                      }`} />
                    ) : (
                      <IoTime className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {activity.type === 'image' ? 'Tagged' : 'Watched'} {activity.count} {
                        activity.type === 'image' ? 'images' : 'videos'
                      }
                    </p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{activity.reward} points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default ProfileScreen;