/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Film, User, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Video {
  id: string
  url: string
  title: string
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, onClick, isActive }) => (
  <motion.button
    onClick={onClick}
    className={`flex flex-col items-center transition-all duration-300 ${
      isActive ? 'text-white' : 'text-gray-400'
    }`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className={`p-2 rounded-full ${
        isActive
          ? 'bg-white text-black'
          : 'bg-gray-800'
      }`}
      animate={{ y: isActive ? -8 : 0 }}
    >
      {icon}
    </motion.div>
    <span className="text-xs font-medium mt-1">{label}</span>
  </motion.button>
)

export default function ShortsPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({})
  const [isDoubleTapLiking, setIsDoubleTapLiking] = useState(false)

  // Sample videos - replace with actual API call
  const videos: Video[] = [
    {
      id: 'v1',
      url: '/shorts/videoa.mp4',
      title: 'Video Play'
    },
    {
      id: 'v2',
      url: '/shorts/videop.mp4', 
      title: 'Video Play 2'
    },
    {
      id: 'v3',
      url: '/shorts/videopl.mp4',
      title: 'Video Play 3'
    },
    {
        id: 'v4',
        url: '/shorts/videopla.mp4',
        title: 'Video Play 3'
      },
      {
        id: 'v5',
        url: '/shorts/videoplay.mp4',
        title: 'Video Play 5'
      },
      {
        id: 'v6',
        url: '/shorts/videoplayb.mp4',
        title: 'Video Play 6'
      },
      {
        id: 'v7',
        url: '/shorts/videoplaybac.mp4',
        title: 'Video Play 7'
      },
      {
        id: 'v8',
        url: '/shorts/videoplayback.mp4',
        title: 'Video Play 8'
      },
      {
        id: 'v9',
        url: '/shorts/videoplayba.mp4',
        title: 'Video Play 9'
      }

  ]

  const handleSwipe = (direction: number) => {
    if (direction > 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction < 0 && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleDoubleTap = async (videoId: string) => {
    if (isDoubleTapLiking) return

    setIsDoubleTapLiking(true)
    try {
      setLikedVideos(prev => ({...prev, [videoId]: true}))
      
      setTimeout(() => {
        setLikedVideos(prev => ({...prev, [videoId]: false}))
      }, 1000)
    } finally {
      setIsDoubleTapLiking(false)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent p-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Tapster
        </h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          className="relative h-full w-full"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(e, info) => handleSwipe(info.offset.y)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <video
            src={videos[currentIndex]?.url}
            className="h-full w-full object-cover"
            autoPlay
            loop
            playsInline
            controls // Added controls to allow users to control audio
          />
          
          <div 
            className="absolute inset-0 z-10"
            onDoubleClick={() => handleDoubleTap(videos[currentIndex].id)}
          >
            {likedVideos[videos[currentIndex].id] && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Heart className="w-20 h-20 text-red-500 fill-red-500" />
              </motion.div>
            )}
          </div>

          <div className="absolute bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-white text-lg font-semibold">
              {videos[currentIndex]?.title}
            </h2>
            <p className="text-white/80 text-sm">
              Swipe up/down to navigate • Double tap to like
            </p>
          </div>

          {currentIndex > 0 && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-white/50 text-sm">
              Swipe down for previous video
            </div>
          )}
          {currentIndex < videos.length - 1 && (
            <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-white/50 text-sm">
              Swipe up for next video
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <motion.div 
          className="bg-black shadow-lg px-4 py-3 w-full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="flex items-center justify-around max-w-xl mx-auto">
            <NavButton 
              icon={<Sparkles className="w-6 h-6" />} 
              label="Picks" 
              onClick={() => handleNavigation('/play')}
              isActive={false}
            />
            <NavButton 
              icon={<Film className="w-6 h-6" />} 
              label="Shorts" 
              onClick={() => handleNavigation('/shorts')}
              isActive={true}
            />
            <NavButton 
              icon={<User className="w-6 h-6" />} 
              label="Me" 
              onClick={() => handleNavigation('/me')}
              isActive={false}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
