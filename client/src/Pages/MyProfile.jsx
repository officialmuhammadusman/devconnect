import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCode,
  FaSignOutAlt,
  FaEdit,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const MyProfile = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Please log in to view your profile
          </h2>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 mt-1">View your developer profile</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 bg-white/70 backdrop-blur-lg rounded-2xl p-6 h-fit sticky top-24 shadow-lg border border-white/20">
            <div className="flex items-center mb-6">
              <FaUserCircle className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            </div>
            <nav className="space-y-2">
              <Link
                to="/edit-profile"
                className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaEdit className="w-4 h-4 mr-3" />
                Edit Profile
              </Link>
              <Link
                to="/login"
                className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaSignOutAlt className="w-4 h-4 mr-3" />
                Login / Logout
              </Link>
            </nav>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            >
              <aside
                className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  <Link
                    to="/edit-profile"
                    className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaEdit className="w-4 h-4 mr-3" />
                    Edit Profile
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    Login / Logout
                  </Link>
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              {/* Profile Header Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center">
                  {user.profileImage || user.avatar ? (
                    <img
                      src={user.profileImage || user.avatar}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50 hover:ring-blue-100 transition-all duration-300"
                    />
                  ) : (
                    <FaUserCircle className="w-16 h-16 text-blue-600" />
                  )}
                  <div className="ml-4 flex-1">
                    <h1 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                      {user.fullName || user.name}
                    </h1>
                    <p className="text-gray-600 text-sm font-medium">{user.headline || user.role}</p>
                  </div>
                </div>
              </div>

              {/* Profile Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaUserCircle className="w-5 h-5 text-blue-600 mr-2" />
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaBriefcase className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Headline</p>
                      <p className="text-gray-900">{user.headline || user.role || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{user.location || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaBriefcase className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Experience</p>
                      <p className="text-gray-900">{user.experience || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCode className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <p className="text-gray-900">{user.category || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaCode className="w-5 h-5 text-blue-600 mr-2" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                      >
                        <FaCode className="w-3 h-3 mr-1" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Link
                  to="/edit-profile"
                  className="inline-block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md text-center"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;