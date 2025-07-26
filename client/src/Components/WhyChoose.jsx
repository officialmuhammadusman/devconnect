import React from "react";
import { FaLock, FaNetworkWired, FaPenNib, FaComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <FaLock className="w-6 h-6 text-white" />,
    title: "Secure Auth & Profiles",
    description: "Built with modern JWT-based authentication and cloud-hosted developer data.",
    color: "from-blue-600 to-emerald-500",
  },
  {
    icon: <FaNetworkWired className="w-6 h-6 text-white" />,
    title: "Dev-Centric Networking",
    description: "Connect by skills, not just job titles — built specifically for developers.",
    color: "from-purple-600 to-blue-600",
  },
  {
    icon: <FaPenNib className="w-6 h-6 text-white" />,
    title: "Post Projects & Ideas",
    description: "Showcase your work, updates, and insights to real developers.",
    color: "from-blue-600 to-teal-500",
  },
  {
    icon: <FaComments className="w-6 h-6 text-white" />,
    title: "Real-Time Chat & Alerts",
    description: "Instant messages and live alerts when devs engage with your work.",
    color: "from-emerald-500 to-cyan-500",
  },
];

const WhyChoose = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  return (
    <section
      id="why-choose-us"
      className="relative bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 text-gray-800">
          Why Choose DevConnect?
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Purpose-built for modern developers — connect, share, and grow your dev career with tools that matter.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-600/50 hover:scale-105 group"
            >
              <div
                className={`w-12 h-12 flex items-center justify-center mx-auto mb-4 rounded-lg bg-gradient-to-br ${feature.color} shadow-md`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700">
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
