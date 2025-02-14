/* eslint-disable jsx-a11y/alt-text */
import { FaCopy } from "react-icons/fa";
import Header from '../components/Header';
import { useState } from "react";

const BalanceScreen = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const mockAddress = "0x1234567890abcdef";
    const displayText = `${mockAddress.slice(0, 6)}...${mockAddress.slice(-6)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(mockAddress).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        });
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const openPopup = () => {
        setShowPopup(true);
    };

    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#E0E0E2]">
            <div className="flex-grow overflow-y-auto p-2">
                <div className="w-full sm:w-3/4 md:w-2/3 lg:w-full h-36 sm:h-40 bg-[#727774] rounded-xl mt-4 relative p-12">
                    <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-white rounded-full">
                        <button onClick={toggleLogin}>
                            <img
                                src="/images/user-profile.jpg"
                                alt="User Profile"
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white"
                            />
                        </button>
                    </div>
                </div>
                {isLoggedIn ? (
                    <div className="flex-grow flex flex-col items-center justify-start p-4 mt-6">
                        <div className="mt-2 text-2xl sm:text-3xl text-center flex justify-center items-center space-x-2">
                            <span className="truncate max-w-xs">{displayText}</span>
                            <FaCopy
                                className="cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={handleCopy}
                            />
                            {isCopied && <span className="text-sm text-green-500">Copied!</span>}
                            <img onClick={openPopup} className="w-8 h-8" src="/images/verified.png" />
                        </div>
                        <div className='w-full flex gap-8 mt-4'>
                            <div className='w-full flex flex-col p-4 justify-center items-center bg-gray-300 rounded-lg'>
                                <span className='text-[#727774] font-semibold text-lg'>Balance</span>
                                <span className='text-gray-800 text-2xl'><b>1000 Points</b></span>
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-center items-center mt-4">
                            <img
                                src="/images/watch.png"
                                alt="/images/watch.png"
                                className="w-8 h-8 object-cover"
                            />
                            <hr className="w-1/3 h-px my-4 bg-gray-500 border-0" />
                        </div>
                    </div>
                ) : (
                    <div className='w-full flex gap-8 mt-16'>
                        <div className='w-full flex flex-col p-4 justify-center items-center bg-gray-300 rounded-lg'>
                            <button
                                className="px-4 py-2 text-black rounded w-full max-w-xs h-64 sm:w-48 sm:py-3 font-semibold text-lg sm:text-xl"
                                onClick={toggleLogin}
                                type="button"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white p-2">
                        <div className="flex flex-col items-center justify-centerp-6 rounded-lg transform scale-100 transition-transform duration-300 hover:scale-105">
                            <img
                                src="/images/message.png"
                                alt="Captured"
                                className="w-full object-cover rounded-lg"
                            />
                            <button
                                onClick={closePopup}
                                className="mt-4 px-6 py-2 bg-gray-500 text-white text-sm font-medium rounded-md shadow hover:shadow-lg transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 w-full">
                <Header onOptionChange={() => { }} />
            </div>
        </div>
    );
};

export default BalanceScreen;
