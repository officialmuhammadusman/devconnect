// CallToAction.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaSignInAlt } from 'react-icons/fa';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-[#1c2230] via-[#0f172a] to-[#1c2230] text-white py-28 px-6 overflow-hidden">
      {/* ✨ Animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* 🗣️ Headline */}
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
          Ready to Build Your Developer Network?
        </h2>

        {/* 💬 Sub-headline */}
        <p className="text-gray-300 text-lg md:text-xl mb-14 max-w-2xl mx-auto">
          Sign up today and start connecting with like-minded devs around the globe.
        </p>

        {/* 🔘 CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Primary – Get Started */}
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <FaArrowRight className="text-xl" />
          </button>

          {/* Secondary – Login */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 text-gray-200 hover:text-white hover:underline text-base font-medium transition-colors"
          >
            <FaSignInAlt className="text-lg" />
            Already have an account? <span className="font-semibold">Log in</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
