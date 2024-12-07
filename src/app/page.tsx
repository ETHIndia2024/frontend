'use client';
import React from "react";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  return (
    <main className="h-full w-full pt-[70px] bg-gradient-to-b from-indigo-600 via-blue-600 to-cyan-600 relative overflow-hidden">
      <div className="min-h-[calc(100vh-70px)] w-full rounded-md flex flex-col items-center justify-center relative mx-auto px-4 bg-gradient-to-r from-indigo-800 via-blue-700 to-cyan-800">
        {/* Spotlight or other graphic element */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        
        {/* Hero Content */}
        <div className="relative z-10 w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <span className="relative inline-block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                <Typewriter
                  words={["Watch", "Like", "Enjoy", "Earn"]}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70} 
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
              
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                content on
              </span>

              <span className="relative inline-block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-extrabold">
                <Typewriter
                  words={["Tapster"]}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </div>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join the future of content engagement. Watch your favorite shorts, discover amazing content, and earn rewards with every interaction.
          </p>
        </div>

        {/* Call-to-Action Section */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-6 sm:px-0">
          <Link href="/play" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 font-bold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate__animated animate__pulse animate__infinite animate__delay-1s"
            >
              Start Earning
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline" 
              className="w-full relative overflow-hidden border-2 border-yellow-300/50 text-white font-bold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate__animated animate__fadeIn animate__delay-3s backdrop-blur-sm group bg-yellow-500"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✨
              </span>
              <span className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                Want to develop datasets?
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
