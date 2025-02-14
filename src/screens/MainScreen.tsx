"use client";
import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useZkVerify } from '../hooks/useZkVerify';
import { zkVerifySession, Library, CurveType, ZkVerifyEvents } from 'zkverifyjs';

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

interface VerifyInput {
  verificationKey: {
    protocol: string;
    curve: string;
    data: {
      alpha: string[];
      beta: string[][];
      gamma: string[];
      delta: string[];
      gamma_abc: string[][];
    }
  };
  proof: {
    protocol: string;
    curve: string;
    data: {
      pi_a: string[];
      pi_b: string[][];
      pi_c: string[];
    }
  };
  publicSignals: number[];
  verificationKeyHash?: string;
}

interface EventData {
  statementHash: string;
  blockHash: string;
  transactionHash: string;
  extrinsicIndex: number;
  fee?: { toString: () => string };
  weight?: {
    refTime: { toString: () => string };
    proofSize: { toString: () => string };
  };
  attestationId: number;
  leafDigest: string;
  attestationHash: string;
}

interface UserSelection {
  category: string;
  label: number;
  timestamp: number;
  verificationHash?: string;
}

const ConsoleMessage = ({ message, delay }: { message: string, delay: number }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-sm font-mono text-green-400 mb-2"
    >
      {`> ${message}`}
    </motion.div>
  );
};

const CatConfirmationScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('cat');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [dragX, setDragX] = useState(0);
  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleStep, setConsoleStep] = useState(0);
  const { verifyProof, isVerifying } = useZkVerify();

  const currentData = getImagesForCategory(selectedCategory);

  const createAttestation = async (selections: string[]) => {
    try {
      // Initialize session with testnet
      const session = await zkVerifySession.start()
        .Testnet()
        .withAccount(process.env.REACT_APP_SEED_PHRASE || '');

      // Generate proof using selections
      const verifyInput: VerifyInput = {
        verificationKey: {
          protocol: "groth16",
          curve: "bn128",
          data: {
            alpha: ["1", "2"],
            beta: [["3", "4"], ["5", "6"]],
            gamma: ["7", "8"],
            delta: ["9", "10"],
            gamma_abc: [["11", "12"], ["13", "14"]]
          }
        },
        proof: {
          protocol: "groth16",
          curve: "bn128",
          data: {
            pi_a: ["15", "16"],
            pi_b: [["17", "18"], ["19", "20"]],
            pi_c: ["21", "22"]
          }
        },
        publicSignals: [1, 2, 3]
      };

      // Register verification key and get hash
      const { events: regEvents } = await session
        .registerVerificationKey()
        .groth16(Library.snarkjs, CurveType.bn128)
        .execute(verifyInput);

      const vkeyHash = await new Promise<string>((resolve, reject) => {
        regEvents.on(ZkVerifyEvents.Finalized, (eventData: EventData) => {
          console.log("Verification key registered:", eventData.statementHash);
          resolve(eventData.statementHash);
        });

        regEvents.on('error', (error) => {
          console.error("Verification key registration error:", error);
          reject(error);
        });
      });

      // Create attestation with the proof
      const attestation = await session
        .verify()
        .groth16(Library.snarkjs, CurveType.bn128)
        .execute({
          proofData: {
            vk: vkeyHash,
            proof: verifyInput.proof,
            publicSignals: verifyInput.publicSignals
          }
        });

      const { events } = attestation;

      // Wait for attestation to be finalized
      await new Promise<void>((resolve, reject) => {
        events.on(ZkVerifyEvents.Finalized, (eventData: EventData) => {
          console.log("Attestation finalized:", eventData);
          toast.success('✅ Attestation created successfully!');
          resolve();
        });

        events.on('error', (error) => {
          console.error("Attestation error:", error);
          reject(error);
        });
      });

    } catch (error: any) {
      console.error('Failed to create attestation:', error);
      toast.error('❌ Failed to create attestation: ' + error.message);
    }
  };

  const onTaskComplete = async () => {
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    if (newSwipeCount === 3) {
      setIsPopupVisible(true);
      setPopupTitle("Great job! You've completed 3 tags!");
      
      // Create attestation for the completed tags
      await createAttestation(["1", "2", "3"]);
      
      toast.success('🎉 Awesome! You completed 3 tags!', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentData.length);
      toast.info('Next image loaded!', {
        position: "top-right",
        autoClose: 1000,
      });
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
    
    toast.success(isYes ? '✅ Marked as Yes' : '❌ Marked as No', {
      position: "top-right",
      autoClose: 1000,
    });
    
    await onTaskComplete();
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setPopupTitle("");
    setSwipeCount(0);
    setUserSelections([]);
    toast.info('Starting fresh!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleKeepTagging = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentData.length);
    handleClosePopup();
    toast.success('Let\'s keep going! 💪', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#1a1b1e] to-[#2d2e32]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-[#1a1b1e]/80 p-4 border-b border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Tagster</h1>
        </div>
        {/* Question Header */}
        <div className="mt-2">
          <p className="text-2xl font-medium text-white text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
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
          className="w-full p-3 rounded-xl bg-[#2c2d30] text-white border border-gray-700 focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all duration-300"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden pb-16 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="h-full max-w-md mx-auto"
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
              style={{
                x: dragX,
                cursor: "grab",
                perspective: "1000px",
                transform: `rotateY(${dragX * 0.02}deg)`,
              }}
            >
              <img
                src={currentData[currentIndex].img}
                alt="Content"
                className="w-full h-full object-cover"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              
              {/* Action Buttons */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  onClick={() => handleButtonClick("", false)}
                >
                  <FaTimes className="w-8 h-8 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  onClick={() => handleButtonClick("", true)}
                >
                  <FaHeart className="w-8 h-8 text-white" />
                </motion.button>
              </div>
              
              {/* Swipe Indicators */}
              <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
                <AnimatePresence>
                  {swipeDirection === "left" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, x: -50 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: -50 }}
                      className="bg-red-500 rounded-full p-6 shadow-xl"
                    >
                      <FaTimes className="w-16 h-16 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {swipeDirection === "right" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, x: 50 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: 50 }}
                      className="bg-green-500 rounded-full p-6 shadow-xl"
                    >
                      <FaHeart className="w-16 h-16 text-white" />
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#2c2d30] to-[#1a1b1e] rounded-2xl p-8 w-full max-w-sm border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {popupTitle}
            </h3>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleKeepTagging}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300"
              >
                Keep Tagging
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CatConfirmationScreen;
