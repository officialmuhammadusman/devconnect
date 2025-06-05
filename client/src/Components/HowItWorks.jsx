import React from 'react';
// Import icons from react-icons.
// I'm using Font Awesome (Fa) as an example.
// You can choose other icon sets from react-icons if you prefer
// (e.g., Ai for Ant Design Icons, Md for Material Design Icons, etc.)
import { FaUserEdit, FaSearch, FaCommentDots, FaRocket } from 'react-icons/fa'; // Added FaRocket

const HowItWorks = () => {
  const handleGetStarted = () => {
    // Navigate to register page
    console.log('Navigate to register');
  };

  const steps = [
    {
      icon: <FaUserEdit size={40} />, // Changed to FaUserEdit
      title: 'Create Your Profile',
      desc: 'Sign up and showcase your skills, image, and bio.',
      color: 'from-blue-500 to-blue-700',
      badgeColor: 'bg-blue-600',
      glowColor: 'shadow-blue-500/20',
      hoverGlow: 'hover:shadow-blue-500/40',
    },
    {
      icon: <FaSearch size={40} />, // Changed to FaSearch
      title: 'Follow Developers',
      desc: 'Browse by skill and follow devs who inspire you.',
      color: 'from-indigo-500 to-indigo-700',
      badgeColor: 'bg-indigo-600',
      glowColor: 'shadow-indigo-500/20',
      hoverGlow: 'hover:shadow-indigo-500/40',
    },
    {
      icon: <FaCommentDots size={40} />, // Changed to FaCommentDots
      title: 'Post & Collaborate',
      desc: 'Start posting, commenting, and chatting in real time.',
      color: 'from-purple-500 to-purple-700',
      badgeColor: 'bg-purple-600',
      glowColor: 'shadow-purple-500/20',
      hoverGlow: 'hover:shadow-purple-500/40',
    },
  ];

  return (
    <section id='how-it-works' className="bg-gradient-to-br from-[#0f172a] via-[#1c2230] to-[#0f172a] text-white py-24 px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
          How DevConnect Works
        </h2>
        <p className="text-gray-300 text-xl mb-20 max-w-2xl mx-auto leading-relaxed">
          Start building in 3 easy steps and connect with developers around the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 shadow-2xl ${step.glowColor} ${step.hoverGlow}`}
            >
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

              {/* Step Badge */}
              <span
                className={`absolute -top-4 left-6 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg ${step.badgeColor} transform group-hover:scale-110 transition-transform duration-300`}
              >
                Step {index + 1}
              </span>

              {/* Floating Dots Animation */}
              <div className="absolute top-4 right-4 flex space-x-1">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} animate-bounce`}></div>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} animate-bounce delay-100`}></div>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} animate-bounce delay-200`}></div>
              </div>

              {/* Icon Container */}
              <div className="relative mb-8 mt-4">
                <div
                  className={`w-24 h-24 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-2xl text-white text-4xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 relative`}
                >
                  {/* Icon Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {step.desc}
                </p>
              </div>

              {/* Card Bottom Accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Developer Count Badge - Modified to match the "Get Started" button style */}
        <div className="inline-block mb-12 relative">
        
          <div className="relative px-8 py-3 rounded-full bg-white text-black font-bold text-lg tracking-wide shadow-lg border border-gray-200">
          
            Join 100+ Developers Already Collaborating!
          </div>
        </div>

        {/* Enhanced CTA Button - Already modified */}
        <div className="relative inline-block">
          <button
            onClick={handleGetStarted}
            className="relative bg-white text-black px-12 py-5 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="mr-3 text-2xl inline-block">
              <FaRocket className="text-black" />
            </span>
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;