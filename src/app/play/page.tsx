'use client'

import { useWallet } from "@suiet/wallet-kit"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Heart, Star, Film, ChevronDown, ChevronUp } from 'lucide-react'
import Image from "next/image"
import { useState, useCallback, useEffect } from "react"

interface ImagePair {
  id: string
  images: { id: string; url: string,labellingJobId:string }[]
}

export default function PlayPage() {
  const wallet = useWallet();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('images')
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({})
  const [isLiking, setIsLiking] = useState(false)
  const [imagePairs, setImagePairs] = useState<ImagePair[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mainCategories = [
    { name: 'images', label: 'Images', icon: <Star className="w-5 h-5" /> },
    { name: 'shorts', label: 'Shorts', icon: <Film className="w-5 h-5" /> },
  ]

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const videos = [
    { id: 'v1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 'v2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 'v3', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  ]

  const fetchImages = async (walletAddress: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/user/get_job_set?walletAddress=${walletAddress}`)
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      const imageUrls = data.images.map((image: { id: string; url: string }) => ({
        id: image.id,
        url: image.url,
      }))
      setImagePairs([...imagePairs, { id: Date.now().toString(), images: data.images }])
    } catch (err) {
      setError('Failed to load images. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const handleLike = useCallback(async (imageId: string) => {
    setIsLiking(true)
    try {
      const currentPair = imagePairs[currentIndex]
      console.log(currentPair)
      const likedImage = currentPair.images.find(img => img.id === imageId)
      if (!likedImage) throw new Error('Image not found')
      if(!wallet.account?.address) return;
      const response = await fetch('/api/user/submit_job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress:wallet.account?.address,
          labellingJobId: currentPair.images[0].labellingJobId,
          imageId: imageId,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to submit result')
      }
      setLikedStates(prev => ({ ...prev, [imageId]: true }))
      if (currentIndex === imagePairs.length - 1) {
        if (wallet.account?.address) {
          await fetchImages(wallet.account.address)
        }
      }
      setCurrentIndex(prev => (prev + 1) % imagePairs.length)
    } catch (err) {
      setError('Failed to submit like. Please try again.')
    } finally {
      setIsLiking(false)
    }
  }, [currentIndex, imagePairs, fetchImages])

  const handleNext = useCallback(() => {
    if (currentIndex === imagePairs.length - 1) {
      if (wallet.account?.address) {
        fetchImages(wallet.account.address)
      }
    }
    setCurrentIndex(prev => (prev + 1) % imagePairs.length)
  }, [currentIndex, imagePairs.length, fetchImages])

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + imagePairs.length) % imagePairs.length)
  }, [imagePairs.length])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.y, info.velocity.y)
    if (swipe < -swipeConfidenceThreshold) {
      handleNext()
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrevious()
    }
  }

  useEffect(() => {
    if (wallet.account?.address && imagePairs.length === 0) {
      fetchImages(wallet.account.address)
    }
  }, [wallet.account?.address, imagePairs.length])

  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedMainCategory])

  if (isLoading && imagePairs.length === 0) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (error && imagePairs.length === 0) {
    return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="h-screen pt-[90px] bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedMainCategory === 'images' ? (
            <motion.div
              key="images"
              className="flex gap-4 px-6 pb-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              
              {imagePairs[currentIndex]?.images.map((image, index) => {
                console.log()
                return (
                  <motion.div
                    key={image.id}
                    className="flex-1 relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <motion.div
                      className={`rounded-2xl p-0.5 bg-gradient-to-b ${index === 0 ? 'from-blue-400 to-green-400' : 'from-pink-400 to-red-400'
                        } shadow-lg`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="relative rounded-xl overflow-hidden w-full aspect-[3/4] bg-gray-100">
                        <Image
                          // src={`${process.env.NEXT_PUBLIC_AGGREGATOR}/v1/${image.url}`}
                          src="https://placehold.co/600x400.png"
                          alt={`Image ${image.id}`}
                          fill
                          className="object-cover"
                        />
                        <motion.button
                          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(image.id)}
                          disabled={isLiking}
                          aria-label={`Like image ${image.id}`}
                        >
                          <Heart className={`w-5 h-5 ${likedStates[image.id] ? 'text-red-500 fill-red-500' : 'text-gray-400'
                            }`} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="shorts"
              className="w-full h-[70vh] aspect-[9/16] relative"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <video
                key={videos[currentIndex]?.id}
                src={videos[currentIndex]?.url}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
                <motion.button
                  className="p-3 bg-white rounded-full shadow-lg"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(videos[currentIndex]?.id)}
                  aria-label={`Like video ${videos[currentIndex]?.id}`}
                >
                  <Heart className={`w-6 h-6 ${likedStates[videos[currentIndex]?.id] ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                </motion.button>
                <div className="flex flex-col gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevious}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                    aria-label="Previous video"
                  >
                    <ChevronUp className="w-6 h-6 text-white" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNext}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                    aria-label="Next video"
                  >
                    <ChevronDown className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-6 pb-4">
          <div className="flex rounded-lg bg-gray-100 p-1 gap-2 mb-6">
            {mainCategories.map((category) => (
              <motion.button
                key={category.name}
                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm transition-all
                  ${selectedMainCategory === category.name
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMainCategory(category.name)}
              >
                {category.icon}
                <span className="font-medium">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}
