"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useAccount, useBalance } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { RootState } from "../store/store";
import { CategoryState } from "../store/stringSlice";
import { useSelector } from 'react-redux';
import useZkVerify from "../hooks/useZkVerify";
import useEduToken from "../hooks/useEduToken";
import { openCampusCodex } from '../config/chains';

const bananaData = [
  { img: "/images/fruits/fruit1.jpeg", question: "Rate the Banana", properties: ["Raw", "Ripe", "Overripe", "Rotten"] },
  { img: "/images/fruits/fruit2.jpeg", question: "Rate the Banana", properties: ["Raw", "Ripe", "Overripe", "Rotten"] },
  { img: "/images/fruits/fruit3.jpeg", question: "Rate the Banana", properties: ["Raw", "Ripe", "Overripe", "Rotten"] },
  { img: "/images/fruits/fruit4.jpeg", question: "Rate the Banana", properties: ["Raw", "Ripe", "Overripe", "Rotten"] },
  { img: "/images/fruits/fruit5.jpeg", question: "Rate the Banana", properties: ["Raw", "Ripe", "Overripe", "Rotten"] }
];

const automobileData = [
  {
    img: "/images/automobile/bk1.jpg",
    question: "Rate the Automobile",
    properties: ["Bike", "Car", "Truck", "Auto"]
  },
  {
    img: "/images/automobile/bk2.jpg",
    question: "Rate the Automobile",
    properties: ["Bike", "Car", "Truck", "Auto"]
  },
  {
    img: "/images/automobile/bk3.jpg",
    question: "Rate the Automobile",
    properties: ["Bike", "Car", "Truck", "Auto"]
  },
  {
    img: "/images/automobile/bk4.jpg",
    question: "Rate the Automobile",
    properties: ["Bike", "Car", "Truck", "Auto"]
  },
];

const plantData = [
  {
    img: "/images/plant/pl1.jpg",
    question: "Rate the Plant",
    properties: ["Herbs", "Shrubs", "Trees", "Climbers"]
  },
  {
    img: "/images/plant/pl2.jpg",
    question: "Rate the Plant",
    properties: ["Herbs", "Shrubs", "Trees", "Climbers"]
  },
  {
    img: "/images/plant/pl3.jpg",
    question: "Rate the Plant",
    properties: ["Herbs", "Shrubs", "Trees", "Climbers"]
  },
  {
    img: "/images/plant/pl4.jpg",
    question: "Rate the Plant",
    properties: ["Herbs", "Shrubs", "Trees", "Climbers"]
  }
];

const garbageData = [
  {
    img: "/images/waste/gab1.jpg",
    question: "Rate the Garbage",
    properties: ["Organic", "Paper", "Plastic", "Glass"]
  },
  {
    img: "/images/waste/gab2.jpg",
    question: "Rate the Garbage",
    properties: ["Organic", "Paper", "Plastic", "Glass"]
  },
  {
    img: "/images/waste/gab3.jpg",
    question: "Rate the Garbage",
    properties: ["Organic", "Paper", "Plastic", "Glass"]
  },
  {
    img: "/images/waste/gab4.jpg",
    question: "Rate the Garbage",
    properties: ["Organic", "Paper", "Plastic", "Glass"]
  }
];

interface UserSelection {
  category: string;
  label: number;
  timestamp: number;
}

const FruitConfirmationScreen = () => {
  const category = useSelector((state: RootState) => state.category.category) as CategoryState;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const { address } = useAccount();
  const { data: addressData } = useBalance({ address });
  const [bal, setBal] = useState(0);
  const { ready, authenticated } = usePrivy();
  const [swipeCount, setSwipeCount] = useState(0);
  
  // zkVerify integration
  const { verifyProof, isVerifying, verificationSuccess, verificationError } = useZkVerify();
  
  // EDU token integration
  const { sendReward, isTransferring, isTransferred, transferError } = useEduToken();

  const [userSelections, setUserSelections] = useState<UserSelection[]>([]);

  const getCategoryData = () => {
    switch (category) {
      case 'banana':
        return bananaData;
      case 'plant':
        return plantData;
      case 'garbage':
        return garbageData;
      case 'automobile':
        return automobileData;
      default:
        return bananaData;
    }
  };

  const fruitData = getCategoryData();

  const handleVerificationAndReward = async (selections: UserSelection[]) => {
    try {
      setPopupTitle("Verifying your submissions...");
      
      // Generate proof data from user selections
      const mockImageData = {
        proof: {
          // This would normally be generated from the circuit
          pi_a: ["0x123", "0x456"],
          pi_b: [["0x789", "0xabc"], ["0xdef", "0x012"]],
          pi_c: ["0x345", "0x678"],
          protocol: "groth16"
        },
        correctLabel: selections[selections.length - 1].label // For demo, use last selection
      };

      // Verify the proof
      await verifyProof(mockImageData, selections[selections.length - 1].label);

      if (verificationSuccess) {
        setPopupTitle("Verification successful! Sending reward...");
        // Send EDU token reward
        const tx = await sendReward();
        if (tx?.hash) {
          const explorerUrl = `${openCampusCodex.blockExplorers.default.url}/tx/${tx.hash}`;
          setPopupTitle(`🎉 Success! 0.001 EDU tokens sent to your wallet! <a href="${explorerUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">View Transaction</a>`);
        } else {
          setPopupTitle("🎉 Success! 0.001 EDU tokens sent to your wallet!");
        }
      }
    } catch (error: any) {
      console.error('Verification or reward error:', error);
      setPopupTitle(`❌ Error: ${error.message}`);
    }
  };

  const onTaskComplete = async () => {
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    
    if (newSwipeCount === 3) {
      setIsPopupVisible(true);
      await handleVerificationAndReward(userSelections);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fruitData.length);
    }
  };

  const handleButtonClick = async (property: string) => {
    const labelMap: { [key: string]: number } = {
      'raw': 0, 'ripe': 1, 'overripe': 2, 'rotten': 3,
      'bike': 0, 'car': 1, 'truck': 2, 'auto': 3,
      'herbs': 0, 'shrubs': 1, 'trees': 2, 'climbers': 3,
      'organic': 0, 'paper': 1, 'plastic': 2, 'glass': 3
    };
    
    const numericLabel = labelMap[property.toLowerCase()];
    
    // Store user's selection
    setUserSelections(prev => [...prev, {
      category,
      label: numericLabel,
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fruitData.length);
    handleClosePopup();
  };

  useEffect(() => {
    if (addressData) {
      setBal(Number(addressData?.formatted) * 2500);
    }
  }, [addressData]);

  const renderVerificationStatus = () => {
    if (isVerifying) return "🔄 Verifying your submissions...";
    if (verificationError) return `❌ Verification failed: ${verificationError}`;
    if (isTransferring) return "💸 Sending EDU tokens...";
    if (transferError) return `❌ Token transfer failed: ${transferError}`;
    if (isTransferred) return "✅ Success! 0.001 EDU tokens sent to your wallet!";
    return null;
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#E0E0E2]">
      <div
        id="cat-details"
        className="bg-cover bg-center bg-no-repeat flex flex-col rounded-3xl flex-grow mx-4 my-5 sm:mx-8 sm:my-6"
        style={{
          backgroundImage: `url(${fruitData[currentIndex].img})`
        }}
      >
        {ready && authenticated && (
          <div className="flex justify-start p-5">
            <span className="bg-gray-300 rounded-full text-gray-800 text-2xl p-3 px-4">
              <b> 💰 $ {bal.toString().slice(0, 4)}</b>
            </span>
          </div>
        )}
        <div className="flex flex-col items-center flex-grow p-4 sm:p-5">
          <div className="relative w-full flex-grow flex items-center justify-center">
            {/* Progress indicator */}
            <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1">
              {swipeCount}/3 Tags
            </div>
          </div>

          <div className="flex space-x-4 mt-4 w-10/12 justify-center">
            <div className="bg-[#E0E0E2] bg-opacity-80 rounded-md w-[100%] flex flex-col justify-center px-4">
              <div className="flex justify-center p-2">
                {fruitData[currentIndex].question}
              </div>

              <div className="gap-2 py-2 grid grid-cols-2">
                {fruitData[currentIndex].properties.map((property, index) => (
                  <div className="flex justify-center"
                    key={index}
                    onClick={() => handleButtonClick(property)}
                  >
                    <input
                      className="peer sr-only"
                      value={property.toLowerCase()}
                      name="ripeness"
                      id={property.toLowerCase()}
                      type="radio"
                    />
                    <div className="flex h-8 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-blue-400 active:scale-95 peer-checked:border-blue-500 peer-checked:shadow-md peer-checked:shadow-blue-400">
                      <label
                        className="flex cursor-pointer items-center justify-center text-sm uppercase text-gray-500 peer-checked:text-blue-500"
                      >
                        {property}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Header onOptionChange={() => { }} />
      </div>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/3 text-center">
            <h3 
              className="text-lg font-semibold mb-4"
              dangerouslySetInnerHTML={{ __html: popupTitle }}
            />
            <div className="mb-4 text-sm text-gray-600">
              {renderVerificationStatus()}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
              {!isVerifying && !isTransferring && (
                <button
                  onClick={handleKeepTagging}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Keep Tagging
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FruitConfirmationScreen;
