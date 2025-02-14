"use client";
import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

const categories = [
  'automobile',
  'cat',
  'girl',
  'plant',
  'rash',
  'user',
  'waste',
  'fruits',
  'fur'
];

const getImagesForCategory = (category: string) => {
  if (category === 'cat') {
    return [
      { img: '/images/cat1.jpg', question: 'Is this a cat?' },
      { img: '/images/cat2.jpg', question: 'Is this a cat?' },
      { img: '/images/cat3.jpg', question: 'Is this a cat?' },
      { img: '/images/cat4.jpg', question: 'Is this a cat?' },
      { img: '/images/cat5.jpg', question: 'Is this a cat?' },
    ];
  }
  
  return [
    { img: `/images/${category}/${category}1.jpg`, question: `Is this a ${category}?` },
    { img: `/images/${category}/${category}2.jpg`, question: `Is this a ${category}?` },
    { img: `/images/${category}/${category}3.jpg`, question: `Is this a ${category}?` },
    { img: `/images/${category}/${category}4.jpg`, question: `Is this a ${category}?` },
    { img: `/images/${category}/${category}5.jpg`, question: `Is this a ${category}?` },
  ];
};

interface UserSelection {
  category: string;
  label: number;
  timestamp: number;
}

const CatConfirmationScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('cat');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [dragX, setDragX] = useState(0);
  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);
  const [swipeCount, setSwipeCount] = useState(0);

  const currentData = getImagesForCategory(selectedCategory);

  const onTaskComplete = async () => {
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    if (newSwipeCount === 3) {
      setIsPopupVisible(true);
      setPopupTitle("Great job! You've completed 3 tags!");
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
      handleButtonClick("Great job! Keep tagging!", false);
    } else if (swipe > swipeConfidenceThreshold) {
      handleButtonClick("Great job! Keep tagging!", true);
    }
    setSwipeDirection(null);
    setDragX(0);
  };

  const handleButtonClick = async (title: string, isYes: boolean) => {
    setUserSelections(prev => [...prev, {
      category: selectedCategory,
      label: isYes ? 1 : 0,
      timestamp: Date.now()
    }]);
    
    await onTaskComplete();
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setPopupTitle("");
    setSwipeCount(0);
    setUserSelections([]);
  };

  const handleKeepTagging = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentData.length);
    handleClosePopup();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1b1e]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[#1a1b1e] p-4 border-b border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-white">Tapp</h1>
        </div>
        {/* Question Header */}
        <div className="mt-2">
          <p className="text-xl font-medium text-white text-center">
            {currentData[currentIndex].question}
          </p>
          <p className="text-sm text-gray-400 text-center mt-1">
            Swipe right for Yes, left for No
          </p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="p-4">
        <select 
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentIndex(0);
          }}
          className="w-full p-3 rounded-xl bg-[#2c2d30] text-white border border-gray-700 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
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
              className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl"
              style={{
                x: dragX,
                cursor: "grab"
              }}
            >
              <img
                src={currentData[currentIndex].img}
                alt="Content"
                className="w-full h-full object-cover"
              />
              
              {/* Swipe Indicators */}
              <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
                <AnimatePresence>
                  {swipeDirection === "left" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="bg-red-500 rounded-full p-4"
                    >
                      <IoCloseCircleOutline className="w-12 h-12 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {swipeDirection === "right" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="bg-green-500 rounded-full p-4"
                    >
                      <IoCheckmarkCircleOutline className="w-12 h-12 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2c2d30] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              {popupTitle}
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleKeepTagging}
                className="px-6 py-3 bg-[#4f46e5] text-white rounded-xl font-medium hover:bg-[#4338ca] transition-colors"
              >
                Keep Tagging
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatConfirmationScreen;
