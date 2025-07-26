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
  FaEnvelope,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { socket } from "../utils/socket";

const normalizeLocation = (location) => {
  if (!location) return "Unknown Location";
  const parts = location.split(",").map((part) => part.trim());
  const countries = ["Pakistan", "India", "USA", "Australia"];
  return countries.includes(parts[0]) ? parts[0] : parts[0] || "Unknown Location";
};

const normalizeCategory = (category) => {
  if (!category) return "other";
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("frontend") || lowerCategory.includes("front-end") || lowerCategory.includes("ui") || lowerCategory.includes("react") || lowerCategory.includes("vue") || lowerCategory.includes("angular")) {
    return "frontend";
  } else if (lowerCategory.includes("backend") || lowerCategory.includes("back-end") || lowerCategory.includes("server") || lowerCategory.includes("node") || lowerCategory.includes("django") || lowerCategory.includes("flask")) {
    return "backend";
  } else if (lowerCategory.includes("fullstack") || lowerCategory.includes("full-stack") || lowerCategory.includes("full stack")) {
    return "fullstack";
  } else if (lowerCategory.includes("ai") || lowerCategory.includes("machine learning") || lowerCategory.includes("ml") || lowerCategory.includes("artificial intelligence") || lowerCategory.includes("data science")) {
    return "ai";
  } else if (lowerCategory.includes("mobile") || lowerCategory.includes("flutter") || lowerCategory.includes("react native") || lowerCategory.includes("swift") || lowerCategory.includes("kotlin") || lowerCategory.includes("android") || lowerCategory.includes("ios")) {
    return "mobile";
  }
  return "other";
};

const AllDevelopers = () => {
  const { user, loading: authLoading, getAllDevelopers, initiateChat } = useAuth();
  const navigate = useNavigate();

  const [allDevelopersData, setAllDevelopersData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChats, setPendingChats] = useState({});
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    const fetchAllUsersData = async () => {
      if (!authLoading) {
        setLocalLoading(true);
        setError(null);
        try {
          const result = await getAllDevelopers("all");
          if (result.success) {
            setAllDevelopersData(result.developers || []);
          } else {
            setError(result.message || "Failed to load developers.");
          }
        } catch (err) {
          setError(err.message || "An error occurred while fetching developers.");
        } finally {
          setLocalLoading(false);
        }
      }
    };

    fetchAllUsersData();
  }, [getAllDevelopers, authLoading]);

  useEffect(() => {
    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const formattedAllDevelopers = React.useMemo(() => {
    return allDevelopersData.map((dev) => ({
      id: dev._id || dev.id,
      name: dev.fullName || "Anonymous",
      headline: dev.headline || "Developer",
      location: dev.location?.trim() ? normalizeLocation(dev.location) : "Unknown Location",
      image: dev.profileImage || null,
      skills: dev.skills || [],
      category: normalizeCategory(dev.headline || dev.category || "other"),
      experience: dev.experience || "0 years",
      createdAt: dev.createdAt,
      updatedAt: dev.updatedAt,
    }));
  }, [allDevelopersData]);

  const uniqueLocations = React.useMemo(() => {
    return [...new Set(formattedAllDevelopers.map((dev) => dev.location))]
      .filter((loc) => loc && loc !== "Unknown Location")
      .sort((a, b) => {
        const priorityCountries = ["Pakistan", "India", "USA", "Australia"];
        const aIsPriority = priorityCountries.includes(a);
        const bIsPriority = priorityCountries.includes(b);
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        return a.localeCompare(b);
      });
  }, [formattedAllDevelopers]);

  const filterOptions = React.useMemo(() => [
    { id: "all", label: "All Developers", icon: FaUser, count: formattedAllDevelopers.length },
    { id: "frontend", label: "Frontend Developers", icon: FaCode, count: formattedAllDevelopers.filter((d) => d.category === "frontend").length },
    { id: "backend", label: "Backend Developers", icon: FaDatabase, count: formattedAllDevelopers.filter((d) => d.category === "backend").length },
    { id: "fullstack", label: "Full Stack Developers", icon: FaLayerGroup, count: formattedAllDevelopers.filter((d) => d.category === "fullstack").length },
    { id: "ai", label: "AI/ML Engineers", icon: FaMicrochip, count: formattedAllDevelopers.filter((d) => d.category === "ai").length },
    { id: "mobile", label: "Mobile Developers", icon: FaMobile, count: formattedAllDevelopers.filter((d) => d.category === "mobile").length },
  ], [formattedAllDevelopers]);

  const getSkillIcon = (skill) => {
    const skillIcons = {
      "React": FaCode, "Node.js": FaServer, "Python": FaMicrochip, "JavaScript": FaCode,
      "HTML5": FaGlobe, "CSS3": FaDesktop, "TensorFlow": FaMicrochip, "Flutter": FaMobile,
      "Swift": FaMobile, "MongoDB": FaDatabase, "TypeScript": FaCode, "PyTorch": FaMicrochip,
      "Scikit-learn": FaCog, "Vue.js": FaCode, "Express": FaServer, "PostgreSQL": FaDatabase,
      "Docker": FaBox, "React Native": FaMobile, "Kotlin": FaMobile, "Django": FaServer,
      "AWS": FaGlobe,
    };
    return skillIcons[skill] || FaCode;
  };

  const filteredDevelopers = React.useMemo(() => {
    let currentFiltered = formattedAllDevelopers;

    if (selectedFilter !== "all") {
      currentFiltered = currentFiltered.filter(
        (dev) => dev.category === selectedFilter
      );
    }

    currentFiltered = currentFiltered.filter(
      (dev) =>
        (dev.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dev.skills || []).some((skill) =>
          (skill || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    currentFiltered = currentFiltered.filter(
      (dev) =>
        selectedLocation === "all" ||
        (dev.location || "").toLowerCase() === selectedLocation.toLowerCase()
    );

    return currentFiltered;
  }, [formattedAllDevelopers, selectedFilter, searchTerm, selectedLocation]);

  const sortedDevelopers = React.useMemo(() => {
    return [...filteredDevelopers].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
      } else if (sortBy === "az") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "za") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [filteredDevelopers, sortBy]);

  const handleMessageUser = async (targetUserId) => {
    if (!user) {
      toast.info("Please login to start chatting.");
      navigate("/login");
      return;
    }

    if (pendingChats[targetUserId]) return;

    setPendingChats(prev => ({ ...prev, [targetUserId]: true }));

    try {
      const result = await initiateChat(targetUserId);
      if (result.success) {
        toast.success("Chat initiated!");
        navigate(`/chat/${result.chat._id}`, {
          state: {
            chat: result.chat,
            otherParticipant: allDevelopersData.find(u => u._id === targetUserId)
          }
        });
      } else {
        toast.error(result.message || "Failed to start chat");
      }
    } catch (err) {
      console.error("Error initiating chat:", err);
      toast.error(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setPendingChats(prev => {
        const newState = { ...prev };
        delete newState[targetUserId];
        return newState;
      });
    }
  };

  const DeveloperCard = ({ developer }) => {
    const isPending = pendingChats[developer.id];
    const isCurrentUser = user && user._id === developer.id;

    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="relative">
            {developer.image ? (
              <img
                src={developer.image}
                alt={developer.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-blue-600 shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/64x64/64748b/ffffff?text=${developer.name?.[0] || '?'}`;
                }}
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <FaUserCircle className="text-slate-50 text-2xl sm:text-3xl" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-slate-800 text-base sm:text-lg">{developer.name}</h3>
            <p className="text-slate-800 text-xs sm:text-sm font-medium">{developer.headline}</p>
          </div>
        </div>

        <div className="flex items-center text-slate-800 text-xs sm:text-sm mb-4">
          <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          {developer.location}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {developer.skills.slice(0, 4).map((skill, index) => {
            const IconComponent = getSkillIcon(skill);
            return (
              <span
                key={index}
                className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-slate-50 transition-all duration-300"
              >
                <IconComponent className="w-3 h-3 mr-1" />
                {skill}
              </span>
            );
          })}
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            to={`/my-profile/${developer.id}`}
            className="w-full bg-blue-600 text-slate-50 font-semibold py-2 sm:py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-md text-center text-sm sm:text-base"
          >
            View Profile
          </Link>
          {user && !isCurrentUser && (
            <button
              onClick={() => handleMessageUser(developer.id)}
              disabled={isPending || !isSocketConnected}
              className={`w-full flex items-center justify-center font-semibold py-2 sm:py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-md text-sm sm:text-base ${
                isPending
                  ? "bg-gray-50 text-slate-800 border-2 border-blue-600 cursor-not-allowed"
                  : "bg-emerald-500 text-slate-50 hover:bg-emerald-600"
              }`}
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <FaEnvelope className="mr-2" />
                  {isSocketConnected ? "Message" : "Connecting..."}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const isLoading = authLoading || localLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-800 mb-4">
            Explore Developers
          </h1>
          <p className="text-slate-800 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Find and connect with talented developers from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-full lg:w-80 bg-white rounded-xl p-4 sm:p-6 h-fit sticky top-24 shadow-md">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FaFilter className="text-slate-50 text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
            </div>

            <div className="space-y-2">
              {filterOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedFilter(option.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                      selectedFilter === option.id
                        ? "bg-blue-600 text-slate-50 shadow-md"
                        : "text-slate-800 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-4 h-4 mr-3" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedFilter === option.id ? "bg-slate-50 text-blue-600" : "bg-gray-50 text-slate-800"
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <aside
                className="absolute left-0 top-0 bottom-0 w-full sm:w-80 bg-white p-4 sm:p-6 shadow-lg border-r border-gray-50 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} aria-label="Close filters">
                    <FaTimes className="w-5 h-5 text-blue-600" />
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
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                          selectedFilter === option.id
                            ? "bg-blue-600 text-slate-50 shadow-md"
                            : "text-slate-800 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-3" />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedFilter === option.id ? "bg-slate-50 text-blue-600" : "bg-gray-50 text-slate-800"
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

          <main className="flex-1">
            <div className="bg-white rounded-xl p-4 sm:p-6 mb-8 shadow-md">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                <div className="w-full relative">
                  <FaSearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search developers by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 sm:py-2 rounded-xl border border-gray-50 bg-gray-50 text-slate-800 placeholder:text-slate-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 text-sm sm:text-base"
                  />
                </div>

                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center justify-center p-3 sm:py-2 px-4 rounded-xl bg-blue-600 text-slate-50 font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md text-sm sm:text-base"
                  aria-label="Open filters"
                >
                  <FaFilter className="w-4 h-4 mr-2" />
                  Filters
                </button>

                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-white border border-blue-600 rounded-xl px-4 py-3 sm:py-2 pr-10 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:bg-blue-700 hover:text-slate-50 transition-all duration-300 w-full sm:min-w-[140px] text-sm sm:text-base shadow-sm cursor-pointer"
                  >
                    <option value="all" className="bg-white text-slate-800">All Locations</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location} className="bg-white text-slate-800">{location}</option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-blue-600 rounded-xl px-4 py-3 sm:py-2 pr-10 text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:bg-blue-700 hover:text-slate-50 transition-all duration-300 w-full sm:min-w-[140px] text-sm sm:text-base shadow-sm cursor-pointer"
                  >
                    <option value="newest" className="bg-white text-slate-800">Newest</option>
                    <option value="az" className="bg-white text-slate-800">A-Z</option>
                    <option value="za" className="bg-white text-slate-800">Z-A</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-800 font-medium">Loading developers...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-12 h-12 text-slate-800" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Error</h3>
                <p className="text-slate-800 font-medium">{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                  {sortedDevelopers.length} Developer{sortedDevelopers.length !== 1 ? "s" : ""} Found
                </h2>
                <div className="text-xs sm:text-sm text-slate-800 font-medium">
                  Showing {selectedFilter === "all" ? "all" : filterOptions.find((f) => f.id === selectedFilter)?.label.toLowerCase()} developers
                </div>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedDevelopers.map((developer) => (
                  <DeveloperCard key={developer.id} developer={developer} />
                ))}
              </div>
            )}

            {!isLoading && !error && sortedDevelopers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-12 h-12 text-slate-800" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No developers found</h3>
                <p className="text-slate-800 font-medium">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllDevelopers;