import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaSearch, FaCommentDots, FaRobot } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

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
      icon: <FaUserEdit className="w-6 h-6 text-white" />,
      title: "Create Your Profile",
      description: "Sign up and showcase your skills, image, and bio.",
      color: "from-blue-600 to-emerald-500",
      badgeBg: "bg-blue-600",
    },
    {
      icon: <FaSearch className="w-6 h-6 text-white" />,
      title: "Follow Developers",
      description: "Browse by skill and follow devs who inspire you.",
      color: "from-purple-600 to-blue-600",
      badgeBg: "bg-purple-600",
    },
    {
      icon: <FaCommentDots className="w-6 h-6 text-white" />,
      title: "Explore Developers",
      description: "Post, comment, and chat in real time.",
      color: "from-emerald-500 to-blue-600",
      badgeBg: "bg-emerald-500",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 text-gray-800">
          How DevConnect Works
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with developers worldwide in 3 simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 text-left">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-600/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span
                className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${step.badgeBg}`}
              >
                Step {index + 1}
              </span>

              <div className="mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${step.color} shadow-md`}
                >
                  {step.icon}
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <span className="px-6 py-3 rounded-full bg-white text-gray-800 text-lg font-medium border border-gray-200 shadow-md">
            Join 100+ Developers Already Collaborating!
          </span>
        </div>

        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md inline-flex items-center"
        >
          <FaRobot className="w-5 h-5 mr-2" />
          {user ? "View Your Profile" : "Get Started"}
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
