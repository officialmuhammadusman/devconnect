import React, { useState, useEffect } from "react";
import {
  FaSearch as FaSearchIcon,
  FaMapMarkerAlt,
  FaFilter,
  FaChevronDown,
  FaUser,
  FaCode,
  FaMobile,
  FaDatabase,
  FaLayerGroup,
  FaMicrochip,
  FaBars,
  FaTimes,
  FaCog,
  FaDesktop,
  FaServer,
  FaGlobe,
  FaBox,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AllDevelopers = () => {
  const { token, getAllDevelopers } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getAllDevelopers(selectedFilter);
        if (result.success) {
          setUsers(result.developers || []); // Ensure users is always an array
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch developers");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllDevelopers, selectedFilter]);

  // Compute formattedDevelopers only when users is available
  const formattedDevelopers = users.map((dev) => ({
    id: dev._id || dev.id,
    name: dev.fullName || "Anonymous",
    headline: dev.headline || "Developer",
    location: dev.location?.trim() ? normalizeLocation(dev.location) : "Unknown Location",
    image: dev.profileImage || null,
    skills: dev.skills || [],
    category: dev.category || "other",
    experience: dev.experience || "0 years",
    createdAt: dev.createdAt,
    updatedAt: dev.updatedAt,
  }));

  const normalizeLocation = (location) => {
    if (!location) return "Unknown Location";
    const parts = location.split(",").map((part) => part.trim());
    const countries = ["Pakistan", "India", "USA", "Australia"];
    return countries.includes(parts[0]) ? parts[0] : parts[0] || "Unknown Location";
  };

  const uniqueLocations = [...new Set(formattedDevelopers.map((dev) => dev.location))]
    .filter((loc) => loc && loc !== "Unknown Location")
    .sort((a, b) => {
      const priorityCountries = ["Pakistan", "India", "USA", "Australia"];
      const aIsPriority = priorityCountries.includes(a);
      const bIsPriority = priorityCountries.includes(b);
      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      return a.localeCompare(b);
    });

  const filterOptions = [
    { id: "all", label: "All Developers", icon: FaUser, count: formattedDevelopers.length },
    { id: "frontend", label: "Frontend Developers", icon: FaCode, count: formattedDevelopers.filter((d) => d.category === "frontend").length },
    { id: "backend", label: "Backend Developers", icon: FaDatabase, count: formattedDevelopers.filter((d) => d.category === "backend").length },
    { id: "fullstack", label: "Full Stack Developers", icon: FaLayerGroup, count: formattedDevelopers.filter((d) => d.category === "fullstack").length },
    { id: "ai", label: "AI/ML Engineers", icon: FaMicrochip, count: formattedDevelopers.filter((d) => d.category === "ai").length },
    { id: "mobile", label: "Mobile Developers", icon: FaMobile, count: formattedDevelopers.filter((d) => d.category === "mobile").length },
  ];

  const getSkillIcon = (skill) => {
    const skillIcons = {
      "React": FaCode,
      "Node.js": FaServer,
      "Python": FaMicrochip,
      "JavaScript": FaCode,
      "HTML5": FaGlobe,
      "CSS3": FaDesktop,
      "TensorFlow": FaMicrochip,
      "Flutter": FaMobile,
      "Swift": FaMobile,
      "MongoDB": FaDatabase,
      "TypeScript": FaCode,
      "PyTorch": FaMicrochip,
      "Scikit-learn": FaCog,
      "Vue.js": FaCode,
      "Express": FaServer,
      "PostgreSQL": FaDatabase,
      "Docker": FaBox,
      "React Native": FaMobile,
      "Kotlin": FaMobile,
      "Django": FaServer,
      "AWS": FaGlobe,
    };
    return skillIcons[skill] || FaCode;
  };

  const filteredDevelopers = formattedDevelopers.filter((dev) => {
    const matchesFilter = selectedFilter === "all" || dev.category === selectedFilter;
    const matchesSearch =
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = selectedLocation === "all" || dev.location.toLowerCase() === selectedLocation.toLowerCase();
    return matchesFilter && matchesSearch && matchesLocation;
  });

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
    } else if (sortBy === "experience") {
      const expA = parseInt(a.experience.match(/\d+/)?.[0] || 0);
      const expB = parseInt(b.experience.match(/\d+/)?.[0] || 0);
      return expB - expA;
    } else if (sortBy === "az") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "za") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const DeveloperCard = ({ developer }) => (
    <div className="bg-slate-700/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-2 shadow-lg group">
      <div className="flex items-center mb-4">
        <div className="relative">
          {developer.image ? (
            <img
              src={developer.image}
              alt={developer.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl group-hover:border-cyan-400 transition-all duration-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl">
              <FaUserCircle className="text-white text-3xl" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800"></div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">
            {developer.name}
          </h3>
          <p className="text-slate-300 text-sm font-medium">{developer.headline}</p>
        </div>
      </div>

      <div className="flex items-center text-slate-400 text-sm mb-4">
        <FaMapMarkerAlt className="w-4 h-4 mr-1" />
        {developer.location}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {developer.skills.slice(0, 4).map((skill, index) => {
          const IconComponent = getSkillIcon(skill);
          return (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-700 to-slate-600 text-cyan-300 border border-slate-600 hover:from-cyan-500 hover:to-blue-500 hover:text-white transition-all duration-300"
            >
              <IconComponent className="w-3 h-3 mr-1" />
              {skill}
            </span>
          );
        })}
      </div>

      <Link
        to={`/my-profile/${developer.id}`}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 text-center"
      >
        View Profile
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                DevConnect
              </h1>
              <p className="text-slate-300 mt-1">Discover amazing developers</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition-colors"
            >
              {sidebarOpen ? <FaTimes className="w-5 h-5 text-cyan-400" /> : <FaBars className="w-5 h-5 text-cyan-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Explore Developers
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Find and connect with talented developers from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 h-fit sticky top-24 shadow-lg border border-slate-700/50">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <FaFilter className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-white">Filters</h2>
            </div>

            <div className="space-y-2">
              {filterOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFilter(option.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      selectedFilter === option.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400"
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-4 h-4 mr-3" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedFilter === option.id ? "bg-white/20 text-white" : "bg-slate-600 text-slate-300"
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <aside
                className="absolute left-0 top-0 bottom-0 w-80 bg-slate-800/80 backdrop-blur-lg p-6 shadow-2xl border-r border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <FaTimes className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  {filterOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedFilter(option.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                          selectedFilter === option.id
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400"
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-3" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedFilter === option.id ? "bg-white/20 text-white" : "bg-slate-600 text-slate-300"
                          }`}
                        >
                          {option.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Filters */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-lg border border-slate-700/50">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FaSearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search developers by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  />
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 min-w-[160px]"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 min-w-[140px]"
                  >
                    <option value="newest">Newest</option>
                    <option value="experience">Most Experienced</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300">Loading developers...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
                <p className="text-slate-400">{error}</p>
              </div>
            )}

            {/* Results Header */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {sortedDevelopers.length} Developer{sortedDevelopers.length !== 1 ? "s" : ""} Found
                </h2>
                <div className="text-sm text-slate-400">
                  Showing {selectedFilter === "all" ? "all" : filterOptions.find((f) => f.id === selectedFilter)?.label.toLowerCase()} developers
                </div>
              </div>
            )}

            {/* Developer Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedDevelopers.map((developer) => (
                  <DeveloperCard key={developer.id} developer={developer} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedDevelopers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No developers found</h3>
                <p className="text-slate-400">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllDevelopers;