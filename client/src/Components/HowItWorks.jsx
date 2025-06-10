import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSearch, FaCommentDots, FaRobot } from "react-icons/fa";
import { useAuth} from "../context/AuthContext";

const HowItWorks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate(`/my-profile/${user._id}`);
    } else {
      navigate("/register");
    }
  };

  const steps = [
    {
      icon: <FaUserEdit className="w-8 h-8 text-white" />,
      title: "Create Your Profile",
      description: "Sign up and showcase your skills, image, and bio.",
      color: "from-cyan-600 to-blue-600",
      badgeBg: "bg-blue-600",
    },
    {
      icon: <FaSearch className="w-8 h-8 text-white" />,
      title: "Follow Developers",
      description: "Browse by skill and follow devs who inspire you.",
      color: "from-purple-600 to-indigo-600",
      badgeBg: "bg-purple-600",
    },
    {
      icon: <FaCommentDots className="w-8 h-8 text-white" />,
      title: "Explore Developers",
      description: "Post, comment, and chat in real time.",
      color: "from-blue-600 to-teal-600",
      badgeBg: "bg-teal-600",
    },
  ];

  return (
    <section id="how-it-works" className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          How DevConnect Works
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with developers worldwide in 3 simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-slate-700/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg group"
            >
              {/* Step content Badge */}
              <span className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${step.badgeColor}`}>
                Step {index + 1}
              </span>

              {/* Icon Container */}
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Developer Count Badge */}
        <div className="mb-8">
          <span className="px-6 py-3 rounded-full bg-slate-700/50 backdrop-blur-lg text-slate-200 text-lg font-semibold border border-slate-600/30">
            Join 100+ Developers Already Collaborating!
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 inline-flex items-center"
        >
          <FaRobot className="w-5 h-5 mr-3" />
          {user ? "View Your Profile" : "Get Started"}
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;