import React from "react";
import { FaLock, FaNetworkWired, FaPenNib, FaComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <FaLock className="w-6 h-6 text-white" />,
    title: "Secure Auth & Profiles",
    description: "Built with modern JWT-based authentication and cloud-hosted developer data.",
    color: "from-cyan-600 to-blue-600",
    glow: "shadow-cyan-500/20",
    hover: "hover:shadow-cyan-500/40",
  },
  {
    icon: <FaNetworkWired className="w-6 h-6 text-white" />,
    title: "Dev-Centric Networking",
    description: "Connect by skills, not just job titles — built specifically for developers.",
    color: "from-purple-600 to-indigo-600",
    glow: "shadow-purple-500/20",
    hover: "hover:shadow-purple-500/40",
  },
  {
    icon: <FaPenNib className="w-6 h-6 text-white" />,
    title: "Post Projects & Ideas",
    description: "Showcase your work, updates, and insights to real developers.",
    color: "from-blue-600 to-teal-600",
    glow: "shadow-blue-500/20",
    hover: "hover:shadow-blue-500/40",
  },
  {
    icon: <FaComments className="w-6 h-6 text-white" />,
    title: "Real-Time Chat & Alerts",
    description: "Instant messages and live alerts when devs engage with your work.",
    color: "from-teal-600 to-cyan-600",
    glow: "shadow-teal-500/20",
    hover: "hover:shadow-teal-500/40",
  },
];

const WhyChoose = () => {
  const { user } = useAuth();

  return (
    <section id="why-choose-us" className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Why Choose DevConnect?
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Purpose-built for modern developers — connect, share, and grow your dev career with tools that matter.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-slate-700/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg ${feature.glow} ${feature.hover}`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center mx-auto mb-6 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                {feature.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;