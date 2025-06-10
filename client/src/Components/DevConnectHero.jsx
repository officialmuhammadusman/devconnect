import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const DevConnectHero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Overlay for Glassmorphism Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-center min-h-screen lg:min-h-0">
          {/* Centered Text Content */}
          <div className="text-center space-y-10 max-w-4xl">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight drop-shadow-lg tracking-tight">
                Find Developers.
                <br />
                <span className="font-medium">Build Together.</span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-light">
              The platform where developers discover each other, share projects, and collaborate on amazing ideas.
              <br className="hidden md:block" />
              <span className="font-normal">Join thousands of developers building the future.</span>
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-12">
              {user ? (
                <Link
                  to={`/my-profile/${user._id}`}
                  className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 inline-flex items-center justify-center"
                >
                  <FaUserCircle className="mr-3 w-5 h-5" />
                  View Your Profile
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 inline-flex items-center justify-center"
                >
                  <FaRocket className="mr-3 w-5 h-5" />
                  Get Started
                </Link>
              )}

              <Link
                to="/all-developers"
                className="px-10 py-5 bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold text-lg rounded-xl hover:bg-cyan-500/20 hover:text-white transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
              >
                <FaSearch className="mr-3 w-5 h-5" />
                Explore Developers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -z-10">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4 text-slate-400">
            <div className="w-32 h-32 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-300 font-semibold text-xl">Background Placeholder</h3>
              <p className="text-slate-400 text-sm">Hero background will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevConnectHero;