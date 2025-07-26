import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const DevConnectHero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen bg-gray-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-center min-h-screen lg:min-h-0">
          <div className="text-center space-y-10 max-w-4xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 leading-tight tracking-tight">
                Find Developers.
                <br />
                <span className="font-medium">Build Together.</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              The platform where developers discover each other, share projects, and collaborate on amazing ideas.
              <br className="hidden md:block" />
              <span className="font-normal">Join thousands of developers building the future.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-12">
              {user ? (
                <Link
                  to={`/my-profile/${user._id}`}
                  className="px-10 py-5 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md inline-flex items-center justify-center"
                >
                  <FaUserCircle className="mr-3 w-5 h-5" />
                  View Your Profile
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-10 py-5 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md inline-flex items-center justify-center"
                >
                  <FaRocket className="mr-3 w-5 h-5" />
                  Get Started
                </Link>
              )}

              <Link
                to="/all-developers"
                className="px-10 py-5 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold text-lg rounded-xl hover:bg-blue-600/10 hover:text-blue-700 transition-all duration-300 inline-flex items-center justify-center"
              >
                <FaSearch className="mr-3 w-5 h-5" />
                Explore Developers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevConnectHero;