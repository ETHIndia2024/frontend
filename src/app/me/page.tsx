/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { motion } from 'framer-motion';
import { FaWallet, FaMedal, FaFire, FaGift } from 'react-icons/fa';
import { Film, User, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserStats {
  points: number;
  streak: number;
  rewardsClaimed: number;
  totalAnnotations: number;
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
        isActive ? 'bg-white text-black' : 'bg-gray-800'
      }`}
      animate={{ y: isActive ? -8 : 0 }}
    >
      {icon}
    </motion.div>
    <span className="text-xs font-medium mt-1">{label}</span>
  </motion.button>
)

export default function ProfilePage() {
  const router = useRouter();
  const { connected, account } = useWallet();
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    streak: 0,
    rewardsClaimed: 0,
    totalAnnotations: 0
  });

  useEffect(() => {
    // TODO: Fetch user stats from API
    // This is mock data for now
    setStats({
      points: 1250,
      streak: 7,
      rewardsClaimed: 3,
      totalAnnotations: 156
    });
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-blue-600 to-cyan-600">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Tapster</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
              <span className="text-sm sm:text-base text-white font-bold">{stats.points}</span>
              <span className="text-yellow-300">★</span>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account?.address}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {connected ? (
                  <span>{account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}</span>
                ) : (
                  'Connect Wallet'
                )}
              </h2>
              <p className="text-white/80 text-sm">Level 5 Contributor</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <FaMedal className="text-yellow-300" />
              <span>Points</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{stats.points}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <FaFire className="text-orange-400" />
              <span>Streak</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{stats.streak} days</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <FaGift className="text-purple-300" />
              <span>Rewards</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{stats.rewardsClaimed}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <FaWallet className="text-green-300" />
              <span>Annotations</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{stats.totalAnnotations}</p>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/20" />
                  <div>
                    <p className="text-sm font-medium text-white">Image Annotation</p>
                    <p className="text-xs text-white/60">2 hours ago</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-300">+10 pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-40">
          <h3 className="text-lg font-semibold text-white mb-4">Available Rewards</h3>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">500 Points Milestone</p>
                <p className="text-sm text-white/60">Claim 0.1 SUI</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm text-white font-medium"
              >
                Claim
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Promotional Banner */}
        <motion.div 
          className="fixed bottom-16 left-4 right-4 z-40 max-w-xl mx-auto mb-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm sm:text-base text-white font-bold">Get Paid for Entertainment with tapster!</h3>
                <p className="text-xs text-white/80 mt-0.5">Watch, engage and earn rewards</p>
              </div>
              <motion.button
                className="bg-white text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs shadow-md ml-3 sm:ml-4 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
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
                icon={<Sparkles className="w-6 h-6" />} 
                label="Picks" 
                onClick={() => handleNavigation('/play')}
                isActive={false}
              />
              <NavButton 
                icon={<Film className="w-6 h-6" />} 
                label="Shorts" 
                onClick={() => handleNavigation('/shorts')}
                isActive={false}
              />
              <NavButton 
                icon={<User className="w-6 h-6" />} 
                label="Me" 
                onClick={() => handleNavigation('/me')}
                isActive={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
