/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client';
import { AlignJustify } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ConnectButton } from '@suiet/wallet-kit';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MobileNavbarProps {}

export default function MobileNavbar({}: MobileNavbarProps) {
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4  before:animate-pulse">
            <div className="flex items-center justify-between">
                <motion.h1 
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Tapster
                </motion.h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-white hover:text-white/80 transition-colors">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <AlignJustify className="w-6 h-6 drop-shadow-glow" />
                        </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="md:hidden space-y-3 bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-md border-none shadow-2xl rounded-2xl p-3">
                        <DropdownMenuItem className="hover:bg-purple-100/80 active:bg-purple-200/80 rounded-xl transition-all duration-200 group">
                            <Link href="/dashboard" className="text-purple-600 group-hover:text-purple-800 font-semibold w-full p-2.5 flex items-center gap-2">
                                <motion.span whileHover={{ x: 4 }} className="transition-colors">
                                    Dashboard
                                </motion.span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-purple-100/80 active:bg-purple-200/80 rounded-xl transition-all duration-200 group">
                            <Link href="/play" className="text-purple-600 group-hover:text-purple-800 font-semibold w-full p-2.5 flex items-center gap-2">
                                <motion.span whileHover={{ x: 4 }} className="transition-colors">
                                    Play and Earn
                                </motion.span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-purple-200/50" />
                        <DropdownMenuItem className="hover:bg-purple-100/80 active:bg-purple-200/80 rounded-xl transition-all duration-200 p-2">
                            <ConnectButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}