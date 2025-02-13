import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IoVolumeMute, IoVolumeHigh, IoGift } from 'react-icons/io5';
import { IoHeart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const shortsData = [
  {
    id: 1,
    video: '/shorts/video1.mp4',
    title: '🌟 Epic Moments',
    description: 'Double tap if this made you smile!',
    likes: '45.2K',
  },
  {
    id: 2,
    video: '/shorts/video2.mp4',
    title: '✨ Pure Magic',
    description: 'Some moments just hit different',
    likes: '32.1K',
  },
  {
    id: 3,
    video: '/shorts/video3.mp4',
    title: '🔥 Next Level',
    description: 'Watch till the end!',
    likes: '28.9K',
  },
  {
    id: 4,
    video: '/shorts/video4.mp4',
    title: '💫 Incredible',
    description: 'This is absolutely insane',
    likes: '56.7K',
  },
  {
    id: 5,
    video: '/shorts/video5.mp4',
    title: '🚀 Mind-blowing',
    description: 'You won\'t believe what happens next',
    likes: '41.3K',
  },
  {
    id: 6,
    video: '/shorts/video6.mp4',
    title: '⚡️ Unreal',
    description: 'This changed everything',
    likes: '38.5K',
  },
];

const ShortVideo = ({ short, isActive, onVideoComplete }: { 
  short: typeof shortsData[0], 
  isActive: boolean,
  onVideoComplete: () => void 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapTime = useRef<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  // Get user's audio preference from localStorage, default to unmuted
  const [isMuted, setIsMuted] = useState(() => {
    const savedPreference = localStorage.getItem('shorts-audio-muted');
    return savedPreference ? savedPreference === 'true' : false;
  });
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);

  // Save audio preference whenever it changes
  useEffect(() => {
    localStorage.setItem('shorts-audio-muted', isMuted.toString());
  }, [isMuted]);

  useEffect(() => {
    if (isActive && !hasWatched) {
      const timer = setTimeout(() => {
        setHasWatched(true);
        onVideoComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, hasWatched, onVideoComplete]);

  useEffect(() => {
    if (isActive) {
      const playVideo = async () => {
        try {
          if (videoRef.current) {
            videoRef.current.muted = isMuted;
            await videoRef.current.play();
          }
        } catch (error) {
          console.log('Autoplay failed:', error);
          // If autoplay fails, mute and try again
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            try {
              await videoRef.current.play();
            } catch (retryError) {
              console.log('Retry failed:', retryError);
            }
          }
        }
      };
      playVideo();
    } else {
      videoRef.current?.pause();
    }
  }, [isActive, isMuted]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;
    
    if (tapLength < 300 && tapLength > 0) {
      setIsLiked(true);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
      e.preventDefault();
    }
    lastTapTime.current = currentTime;
  };

  const toggleMute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
      if (!newMutedState) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log('Unmute failed:', error);
          setIsMuted(true);
          videoRef.current.muted = true;
        }
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-black" onClick={handleDoubleTap}>
      {/* Loading Spinner */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={short.video}
        loop
        playsInline
        muted={isMuted}
        onLoadedData={handleVideoLoad}
      />
      
      {/* Double Tap Like Animation */}
      <AnimatePresence>
        {showLikeAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 20, -20, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <IoHeart className="text-red-500 w-40 h-40 drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-24 left-4 right-4 z-10"
      >
        <h2 className="text-white text-2xl font-bold mb-2 text-shadow-lg">{short.title}</h2>
        <p className="text-white/90 text-lg font-medium text-shadow-lg">{short.description}</p>
      </motion.div>

      {/* Audio Control */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md p-3 rounded-full"
      >
        {isMuted ? (
          <IoVolumeMute className="text-white w-6 h-6" />
        ) : (
          <IoVolumeHigh className="text-white w-6 h-6" />
        )}
      </motion.button>

      {/* Like Indicator */}
      {isLiked && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full"
        >
          <IoHeart className="text-red-500 w-5 h-5" />
          <span className="text-white text-sm font-medium">{short.likes}</span>
        </motion.div>
      )}
    </div>
  );
};

const RewardModal = ({ onClaim }: { onClaim: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-purple-600 to-blue-700 p-6 rounded-3xl shadow-2xl max-w-md w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4"
          >
            <IoGift className="text-white w-10 h-10" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Congratulations! 🎉</h2>
          <p className="text-white/90 mb-6">You've watched all the shorts! Claim your reward now.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClaim}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Claim Reward
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ShortsScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStart = useRef(0);
  const [watchedVideos, setWatchedVideos] = useState<Set<number>>(new Set());
  const [showReward, setShowReward] = useState(false);

  const handleVideoComplete = () => {
    const newWatchedVideos = new Set(watchedVideos);
    newWatchedVideos.add(currentIndex);
    setWatchedVideos(newWatchedVideos);

    if (newWatchedVideos.size === shortsData.length) {
      setShowReward(true);
    }
  };

  const handleClaimReward = () => {
    navigate('/screen3');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;

    if (diff > 50 && currentIndex < shortsData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center"
      >
        <h1 className="text-white text-xl font-bold">For You</h1>
        <div className="flex items-center space-x-1">
          {shortsData.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full"
            >
              {watchedVideos.has(index) ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full bg-green-500"
                />
              ) : (
                <div className="w-full h-full bg-white/30" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div 
        className="h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <ShortVideo
              short={shortsData[currentIndex]}
              isActive={true}
              onVideoComplete={handleVideoComplete}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showReward && <RewardModal onClaim={handleClaimReward} />}
      </AnimatePresence>

      <Navigation />
    </div>
  );
};

export default ShortsScreen; 