import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaSearch } from 'react-icons/fa';
import { assets } from '../assets/assets';

const DevConnectHero = () => {
  return (
    <section className="relative bg-white min-h-screen">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://www.bitcoinsensus.com/wp-content/uploads/2025/06/Ethereum-Devconnect-ARG-Scholars-Program-%E2%80%93-Interdisciplinary-Initiative-and-Ecosystem-Expansion.webp"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-center min-h-screen lg:min-h-0">
          
          {/* Centered Text Content */}
          <div className="text-center space-y-10 max-w-4xl">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] drop-shadow-lg tracking-tight">
                Find Developers.
                <br />
                <span className="text-gray-200 font-medium">Build Together.</span>
              </h1>
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-[1.6] drop-shadow-md font-light">
              The platform where developers discover each other, share projects, and collaborate on amazing ideas. 
              <br className="hidden md:block" />
              <span className="font-normal">Join thousands of developers building the future.</span>
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-12">
              <Link 
                to="/register" 
                className="px-10 py-5 bg-white text-gray-900 font-semibold text-lg rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
              >
                <FaRocket className="mr-3 w-5 h-5" />
                Get Started
              </Link>
              
              <Link 
                to="/all-developers" 
                className="px-10 py-5 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
              >
                <FaSearch className="mr-3 w-5 h-5" />
                Explore Developers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for when image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 -z-10">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 text-gray-400">
            <div className="w-32 h-32 mx-auto bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 font-semibold text-xl">Background Image Placeholder</h3>
              <p className="text-gray-600 text-sm">Hero background will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevConnectHero;