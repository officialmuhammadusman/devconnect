import React from 'react';
import { FaLock, FaNetworkWired, FaPenNib, FaComments } from 'react-icons/fa';

const features = [
  {
    icon: <FaLock size={30} />,
    title: 'Secure Auth & Profiles',
    desc: 'Built with modern JWT-based authentication and cloud-hosted developer data.',
    color: 'from-blue-500 to-blue-700',
    glow: 'shadow-blue-500/20',
    hover: 'hover:shadow-blue-500/40',
  },
  {
    icon: <FaNetworkWired size={30} />,
    title: 'Dev-Centric Networking',
    desc: 'Connect by skills, not just job titles — built specifically for developers.',
    color: 'from-indigo-500 to-indigo-700',
    glow: 'shadow-indigo-500/20',
    hover: 'hover:shadow-indigo-500/40',
  },
  {
    icon: <FaPenNib size={30} />,
    title: 'Post Projects & Ideas',
    desc: 'Showcase your work, updates, and insights to real developers.',
    color: 'from-purple-500 to-purple-700',
    glow: 'shadow-purple-500/20',
    hover: 'hover:shadow-purple-500/40',
  },
  {
    icon: <FaComments size={30} />,
    title: 'Real-Time Chat & Alerts',
    desc: 'Instant messages and live alerts when devs engage with your work.',
    color: 'from-teal-500 to-teal-700',
    glow: 'shadow-teal-500/20',
    hover: 'hover:shadow-teal-500/40',
  },
];

const WhyChoose = () => {
  return (
    <section id='why-choose-us' className="bg-[#0f172a] text-white py-24 px-6 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
          Why Choose DevConnect?
        </h2>
        <p className="text-gray-300 text-lg md:text-xl mb-16 max-w-3xl mx-auto leading-relaxed">
          Purpose-built for modern developers — connect, share, and grow your dev career with tools that truly matter.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br from-white/5 via-white/10 to-transparent p-6 rounded-3xl border border-white/10 transition-all duration-500 hover:scale-105 transform backdrop-blur-xl ${feature.glow} ${feature.hover}`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 flex items-center justify-center mx-auto mb-6 rounded-xl bg-gradient-to-br ${feature.color} text-white text-xl shadow-lg`}
              >
                {feature.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
