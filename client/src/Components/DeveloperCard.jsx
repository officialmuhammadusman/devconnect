import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEye, FaRedo, FaArrowRight } from 'react-icons/fa';

const DeveloperCards = () => {
  const [developers] = useState([
    {
      id: 1,
      name: "Muhammad Usman",
      role: "Full Stack Developer (MERN)",
      skills: ["React", "Node.js", "MongoDB"],
      location: "Lahore, PK",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Frontend Developer",
      skills: ["React", "TypeScript", "Tailwind"],
      location: "New York, US",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Ahmed Khan",
      role: "Backend Developer",
      skills: ["Python", "Django", "PostgreSQL"],
      location: "Karachi, PK",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Emily Chen",
      role: "Mobile App Developer",  
      skills: ["React Native", "Swift", "Kotlin"],
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Hassan Ali",
      role: "DevOps Engineer",
      skills: ["Docker", "AWS", "Kubernetes"],
      location: "Islamabad, PK",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Zara Ahmed",
      role: "UI/UX Designer & Developer",
      skills: ["Figma", "React", "CSS"],
      location: "Dubai, UAE",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"
    }
  ]);

  const handleViewProfile = (developerId) => {
    window.open(`/my-profile/${developerId}`, '_blank');
  };

  const handleRefresh = () => {
    console.log('Refreshing developers...');
    alert('New developers loaded!');
  };

  const handleExploreMore = () => {
    window.location.href = '/explore-developers';
  };

  return (
    <div className="min-h-screen bg-[#20263e] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Meet Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Developers</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover talented developers ready to bring your ideas to life and build the future together
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-sky-500/30"
          >
            <FaRedo className="text-lg" />
            Refresh Developers
          </button>
        </div>

        {/* Developer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-sky-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 group hover:bg-white/10"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={dev.avatar}
                    alt={`${dev.name}'s profile`}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-sky-400/50 group-hover:border-sky-400 transition-all duration-300 shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=3b82f6&color=ffffff&size=200`;
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white text-center mb-3 group-hover:text-sky-400 transition-colors duration-300">
                {dev.name}
              </h3>

              <p className="text-gray-300 text-center mb-6 font-medium text-lg">
                {dev.role}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {dev.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm bg-sky-500/20 text-sky-300 rounded-full border border-sky-400/30 hover:bg-sky-500/30 hover:border-sky-400/50 transition-all duration-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
                <FaMapMarkerAlt className="text-lg" />
                <span className="text-sm font-medium">{dev.location}</span>
              </div>

              <button
                onClick={() => handleViewProfile(dev.id)}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white py-4 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-500/30 flex items-center justify-center gap-3 group"
              >
                <FaEye className="text-lg" />
                View Profile
                <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <button 
            onClick={handleExploreMore}
            className="inline-flex items-center bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white py-4 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-500/30 justify-center gap-3 group"
          >
             See More Developers
            <FaArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCards;
