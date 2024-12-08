// 'use client'

// import { useSuiTrueTags } from "@/hooks/useSuiTrueTags"
// import { SuiClient } from "@mysten/sui/client"
// import { useWallet } from "@suiet/wallet-kit"
// import { motion, AnimatePresence, PanInfo } from "framer-motion"
// import { Heart, Star, Film, ChevronDown, ChevronUp } from 'lucide-react'
// import Image from "next/image"
// import { useState, useCallback, useEffect } from "react"

// interface ImagePair {
//   jobId: string
//   jobTitle: string
//   images: { id: string; url: string }[]
// }

// const client = new SuiClient({ 
//         url: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443' 
// });

// export default function PlayPage() {
//   const wallet = useWallet();
//   const [selectedMainCategory, setSelectedMainCategory] = useState<string>('images')
//   const [likedStates, setLikedStates] = useState<Record<string, boolean>>({})
//   const [isLiking, setIsLiking] = useState(false)
//   const [imagePairs, setImagePairs] = useState<ImagePair>()
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null);
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const { submitAnnotation } = useSuiTrueTags(client);

//   const mainCategories = [
//     { name: 'images', label: 'Images', icon: <Star className="w-5 h-5" /> },
//     { name: 'shorts', label: 'Shorts', icon: <Film className="w-5 h-5" /> },
//   ]

//   const swipeConfidenceThreshold = 10000
//   const swipePower = (offset: number, velocity: number) => {
//     return Math.abs(offset) * velocity
//   }

//   const videos = [
//     { id: 'v1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
//     { id: 'v2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
//     { id: 'v3', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
//   ]

//   const fetchImages = async (walletAddress: string) => {
//     setIsLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(`/api/user/get_job_set?walletAddress=${walletAddress}`)
//       if (!response.ok) {
//         throw new Error('Failed to fetch images')
//       }
//       const data = await response.json()
//       console.log(data)
//       setImagePairs({ jobId: data.id, jobTitle: data.title, images: data.images })
//     } catch (err) {
//       setError('Failed to load images. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCreateAttestation = async (jobId: string, imageId: string, otherImageId: string) => {
//     const data = {
//       jobId: jobId,
//       imageId: imageId,
//       otherImageId: otherImageId
//     }
//     console.log("handleCreateAttestation", data)
//     try {
//       if(!wallet.account?.address) return;
//       const annotationData = JSON.stringify(data);
//       const taskId = 1;
//       const result = await submitAnnotation(taskId, annotationData);
//       console.log("submitAnnotation result", result)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleLike = async (imageId: string) => {
//     setIsLiking(true)
//     try {
//       if(!imagePairs) return;
//       const likedImage = imagePairs.images.find(img => img.id === imageId)
//       const otherImage = imagePairs.images.find(img => img.id !== imageId)
//       if (!likedImage || !otherImage) throw new Error('Image not found')
//       if (!wallet.account?.address) return;
//       console.log(imagePairs.jobId, imageId, otherImage.id)

//       await handleCreateAttestation(imagePairs.jobId, imageId, otherImage.id)

//       const response = await fetch('/api/user/submit_job', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           walletAddress: wallet.account?.address,
//           labellingJobId: imagePairs.jobId,
//           winnerId: imageId,
//           loserId: otherImage.id,
//         }),
//       })
//       if (!response.ok) {
//         throw new Error('Failed to submit comparison')
//       }
//       setLikedStates(prev => ({ ...prev, [imageId]: true }))
//       console.log("Liked image", imageId,"fetch new images called")
//       if (wallet.account?.address) {
//         await fetchImages(wallet.account.address)
//       }
//     } catch (err) {
//       setError('Failed to submit comparison. Please try again.')
//     } finally {
//       setIsLiking(false)
//     }
//   }



//   useEffect(() => {
//     if (wallet.account?.address && imagePairs===undefined) {
//       fetchImages(wallet.account.address)
//     }
//   }, [wallet.account?.address, imagePairs])


//   if (imagePairs === undefined) {
//     return <div className="h-screen flex items-center justify-center">Loading...</div>
//   }

//   if (error && imagePairs === undefined) {
//     return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>
//   }

//   return (
//     <div className="h-screen pt-[90px] bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
//         <AnimatePresence mode="wait">
//           {selectedMainCategory === 'images' ? (
//             <motion.div
//               key="images"
//               className="flex gap-4 px-6 pb-6 pt-8"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               {imagePairs.images.map((image, index) => (
//                 <motion.div
//                   key={image.id}
//                   className="flex-1 relative"
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ delay: index * 0.2 }}
//                 >
//                   <motion.div
//                     className={`rounded-2xl p-0.5 bg-gradient-to-b ${index === 0 ? 'from-blue-400 to-green-400' : 'from-pink-400 to-red-400'
//                       } shadow-lg`}
//                     whileHover={{ scale: 1.03 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <div className="relative rounded-xl overflow-hidden w-full aspect-[3/4] bg-gray-100">
//                       <Image
//                         src={`${process.env.NEXT_PUBLIC_AGGREGATOR}/v1/${image.url}`}
//                         alt={`Image ${image.id}`}
//                         fill
//                         className="object-cover"
//                       />
//                       <motion.button
//                         className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md"
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleLike(image.id)}
//                         disabled={isLiking}
//                         aria-label={`Like image ${image.id}`}
//                       >
//                         <Heart className={`w-5 h-5 ${likedStates[image.id] ? 'text-red-500 fill-red-500' : 'text-gray-400'
//                           }`} />
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="shorts"
//               className="w-full h-[70vh] aspect-[9/16] relative"
//               drag="y"
//               dragConstraints={{ top: 0, bottom: 0 }}
//               onDragEnd={()=>{}}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <video
//                 key={videos[currentIndex]?.id}
//                 src={videos[currentIndex]?.url}
//                 className="w-full h-full object-cover"
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//               />
//               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
//               <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
//                 <motion.button
//                   className="p-3 bg-white rounded-full shadow-lg"
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => handleLike(videos[currentIndex]?.id)}
//                   aria-label={`Like video ${videos[currentIndex]?.id}`}
//                 >
//                   <Heart className={`w-6 h-6 ${likedStates[videos[currentIndex]?.id] ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
//                 </motion.button>
//                 <div className="flex flex-col gap-4">
//                   <motion.button
//                     whileTap={{ scale: 0.9 }}
//                     onClick={()=>{}}
//                     className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
//                     aria-label="Previous video"
//                   >
//                     <ChevronUp className="w-6 h-6 text-white" />
//                   </motion.button>
//                   <motion.button
//                     whileTap={{ scale: 0.9 }}
//                     onClick={()=>{}}
//                     className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
//                     aria-label="Next video"
//                   >
//                     <ChevronDown className="w-6 h-6 text-white" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
        
//       </div>
//       {error && <div className="mt-4 text-red-500">{error}</div>}
//     </div>
//   )
// }

'use client'

import { useSuiTrueTags } from "@/hooks/useSuiTrueTags"
import { SuiClient } from "@mysten/sui/client"
import { useWallet } from "@suiet/wallet-kit"
import { motion } from "framer-motion"
import { Heart, Film, User, Sparkles } from 'lucide-react'
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

interface ImagePair {
  jobId: string
  jobTitle: string
  images: { id: string; url: string }[]
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isActive: boolean
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
        isActive ? 'bg-white text-black' : 'bg-gray-800'
      }`}
      animate={{ y: isActive ? -8 : 0 }}
    >
      {icon}
    </motion.div>
    <span className="text-xs font-medium mt-1">{label}</span>
  </motion.button>
)

const client = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443'
})

export default function PlayPage() {
  const router = useRouter()
  const wallet = useWallet()
  const [likedStates, setLikedStates] = useState<Record<string, boolean>>({})
  const [isLiking, setIsLiking] = useState(false)
  const [imagePairs, setImagePairs] = useState<ImagePair>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { submitAnnotation } = useSuiTrueTags(client)
  const [selectedCategory, setSelectedCategory] = useState('Beauty')

  const categories = [
    { id: 'beauty', label: '👩 Beauty' },
    { id: 'car', label: '🚗 Car' },
    { id: 'real-estate', label: '🏠 Real Estate' }
  ]

  const fetchImages = async (walletAddress: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/user/get_job_set?walletAddress=${walletAddress}`)
      if (!response.ok) throw new Error('Failed to fetch images')
      const data = await response.json()
      setImagePairs({ jobId: data.id, jobTitle: data.title, images: data.images })
    } catch {
      setError('Failed to load images. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAttestation = async (jobId: string, imageId: string, otherImageId: string) => {
    if (!wallet.account?.address) return
    try {
      const annotationData = JSON.stringify({ jobId, imageId, otherImageId })
      const taskId = 1
      await submitAnnotation(taskId, annotationData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLike = async (imageId: string) => {
    if (isLiking || !imagePairs || !wallet.account?.address) return
    setIsLiking(true)
    try {
      const otherImage = imagePairs.images.find(img => img.id !== imageId)
      if (!otherImage) throw new Error('Image not found')

      await handleCreateAttestation(imagePairs.jobId, imageId, otherImage.id)
      await fetch('/api/user/submit_job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: wallet.account.address,
          labellingJobId: imagePairs.jobId,
          winnerId: imageId,
          loserId: otherImage.id,
        }),
      })

      setLikedStates(prev => ({ ...prev, [imageId]: true }))
      await fetchImages(wallet.account.address)
    } catch {
      setError('Failed to submit comparison. Please try again.')
    } finally {
      setIsLiking(false)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  useEffect(() => {
    if (wallet.account?.address && imagePairs === undefined) {
      fetchImages(wallet.account.address)
    }
  }, [wallet.account?.address, imagePairs])

  if (isLoading || imagePairs === undefined) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (error && imagePairs === undefined) {
    return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-blue-600 to-cyan-600">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Tapster</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
              <span className="text-sm sm:text-base text-white font-bold">41</span>
              <span className="text-yellow-300">★</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 mt-12 sm:mt-16 scrollbar-hide">
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full whitespace-nowrap text-white ${
                selectedCategory === category.label
                  ? 'bg-white/30 shadow-lg backdrop-blur-sm'
                  : 'bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.label)}
            >
              <span className="text-sm sm:text-base font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Image Comparison Section */}
        <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 mt-8 sm:mt-12">
          {imagePairs.images.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className={`rounded-2xl sm:rounded-3xl p-1 ${
                  index === 0 
                    ? 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400' 
                    : 'bg-gradient-to-br from-green-400 via-teal-400 to-blue-400'
                }`}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative aspect-[5/8] rounded-xl sm:rounded-2xl overflow-hidden bg-white">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_AGGREGATOR}/v1/${image.url}`}
                    alt={`Comparison image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <motion.button
                    className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 p-2 sm:p-3 bg-white rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(image.id)}
                    disabled={isLiking}
                  >
                    <Heart 
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        likedStates[image.id] 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-400'
                      }`}
                    />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-28 sm:mb-32 mt-6 sm:mt-8">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg text-white font-bold">Daily Progress</span>
            <span className="text-xs sm:text-sm text-white/80 mt-0.5 sm:mt-1">Keep going!</span>
          </div>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-blue-200/30 stroke-current"
                strokeWidth="10"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-blue-400 stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                style={{
                  strokeDasharray: '251.2',
                  strokeDashoffset: '0',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-base sm:text-lg font-bold text-white">1000</div>
              <div className="text-[10px] sm:text-xs text-white/80">/ 1000</div>
            </div>
          </div>
        </div>

        {/* Get Paid Banner */}


        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <motion.div 
            className="bg-black shadow-lg px-4 py-3 sm:py-4 w-full"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="flex items-center justify-around max-w-xl mx-auto">
              <NavButton 
                icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />} 
                label="Picks" 
                onClick={() => handleNavigation('/play')}
                isActive={true}
              />
              <NavButton 
                icon={<Film className="w-5 h-5 sm:w-6 sm:h-6" />} 
                label="Shorts" 
                onClick={() => handleNavigation('/shorts')}
                isActive={false}
              />
              <NavButton 
                icon={<User className="w-5 h-5 sm:w-6 sm:h-6" />} 
                label="Me" 
                onClick={() => handleNavigation('/me')}
                isActive={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
