/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
/* @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { parseEther } from "viem";
import type { SendTransactionVariables } from 'wagmi/query';
import type { Config } from 'wagmi';
import { useAccount, useBalance } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { CategoryState } from "../store/stringSlice";
import { RootState } from "../store/store";
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

const catData = [
  { img: "/images/cat1.jpg", question: "Is this a cat?" },
  { img: "/images/cat2.jpg", question: "Is this a cat?" },
  { img: "/images/cat3.jpg", question: "Is this a cat?" },
  { img: "/images/cat4.jpg", question: "Is this a cat?" },
  { img: "/images/cat5.jpg", question: "Is this a cat?" },
];

const rashData = [
  { img: "/images/rash/rash1.jpg", question: "Is this a rash?" },
  { img: "/images/rash/rash2.jpg", question: "Is this a rash?" },
  { img: "/images/rash/rash3.jpg", question: "Is this a rash?" },
  { img: "/images/rash/rash4.jpg", question: "Is this a rash?" },
];

const CatConfirmationScreen = () => {
  const category = useSelector((state: RootState) => state.category.category) as CategoryState;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bal, setBal] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [dragX, setDragX] = useState(0);
  const { address, isConnected } = useAccount();
  const { data: addressData, isLoading } = useBalance({ address });

  const { ready, authenticated, login, logout } = usePrivy();

  const account = useAccount();
  const key = '0xa11aaca3c7025677a643ae70d62cc0e420e6f9a8686986dc6594c4f2f320ad11';
  const sa = privateKeyToAccount(
    key as `0x${string}`
  );
  const to = account.address;
  const {
    data: hash,
    isPending,
    isError,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

    useEffect(() => {
      if (addressData) {
        setBal(Number(addressData?.formatted) * 2500);
      }
    }, [addressData]);
    

  const currentData = category === "cat" ? catData : rashData;

  const onTaskComplete = async () => {
    if (currentIndex === 2) {
      setIsPopupVisible(true);
      const transactionRequest: SendTransactionVariables<Config, number> = {
        account: sa,
        to: to,
        value: parseEther('0.00001'),
        type: 'eip1559',
      };
      sendTransaction(transactionRequest);
      console.log(hash);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentData.length);
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDrag = (event: any, info: PanInfo) => {
    setDragX(info.offset.x);
    if (info.offset.x > 50) {
      setSwipeDirection("right");
    } else if (info.offset.x < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      setDirection("left");
      handleButtonClick("Awesome, you completed 3 Tags today, reward on the way!", false);
    } else if (swipe > swipeConfidenceThreshold) {
      setDirection("right");
      handleButtonClick("Awesome, you completed 3 Tags today, reward on the way!", true);
    }
    setSwipeDirection(null);
    setDragX(0);
  };

  const handleButtonClick = async (title: string, isYes: boolean) => {
    setPopupTitle(title);
    onTaskComplete();
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setPopupTitle("");
  };

  const handleKeepTagging = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentData.length);
    handleClosePopup();
    setBal(Number(addressData?.formatted) * 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1b1e]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[#1a1b1e] p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Tapp</h1>
          {ready && authenticated && (
            <div className="flex items-center space-x-2">
              <span className="bg-[#2c2d30] text-white px-4 py-2 rounded-full text-sm flex items-center">
                💰 ${bal.toString().slice(0, 4)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="p-4 h-full"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              animate={{
                rotate: dragX * 0.03,
                scale: 1 - Math.abs(dragX) * 0.001
              }}
              className="bg-[#2c2d30] rounded-3xl shadow-2xl overflow-hidden h-[calc(100vh-16rem)] relative"
            >
              {/* Task Header */}
              <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div>
                  <p className="font-semibold text-white">AI Training Task</p>
                  <p className="text-sm text-gray-400">Swipe right for Yes, left for No</p>
                </div>
              </div>

              {/* Image */}
              <div className="relative h-full">
                <img
                  src={currentData[currentIndex].img}
                  alt="Training Image"
                  className="w-full h-full object-cover"
                />
                
                {/* Swipe Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: swipeDirection === "left" ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-transparent pointer-events-none"
                >
                  <div className="absolute left-8 top-1/2 -translate-y-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: swipeDirection === "left" ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-red-500 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <IoCloseCircleOutline size={60} />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: swipeDirection === "right" ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-l from-green-500/30 to-transparent pointer-events-none"
                >
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: swipeDirection === "right" ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <IoCheckmarkCircleOutline size={60} />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Question Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
                  <p className="text-2xl font-medium text-white text-center mb-8">
                    {currentData[currentIndex].question}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Popup */}
      {isPopupVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#2c2d30] p-6 rounded-3xl shadow-2xl w-11/12 max-w-md border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-4 text-center text-white">{popupTitle}</h3>

            {isConfirming && (
              <div className="flex justify-center items-center p-4">
                <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {isConfirmed && (
              <div className="flex flex-col gap-3">
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#3a3b3e] hover:bg-[#4a4b4e] text-white px-6 py-3 rounded-full text-center font-medium transition-all duration-300"
                >
                  View Reward
                </a>
                <button
                  onClick={handleKeepTagging}
                  className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-3 rounded-full text-center font-medium transition-all duration-300"
                >
                  Keep tagging
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default CatConfirmationScreen;
