import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const CallToAction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Ready to Build Your Developer Network?
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Sign up today and start connecting with like-minded devs around the globe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => navigate(user ? `/my-profile/${user._id}` : "/register")}
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-10 py-4 rounded-xl text-lg font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {user ? "View Your Profile" : "Get Started"}
            <FaArrowRight className="w-5 h-5" />
          </button>

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-3 text-slate-200 hover:text-cyan-400 text-base font-medium transition-colors duration-300"
            >
              <FaSignInAlt className="w-5 h-5" />
              Already have an account? <span className="font-semibold">Log in</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;