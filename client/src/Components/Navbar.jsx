import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { 
  FaHome, FaSearch, FaUser, FaUserPlus, FaChevronDown, FaChevronUp, 
  FaBell, FaEnvelope, FaCog, FaSignOutAlt, FaUserCircle, FaCode,
  FaThumbsUp, FaComment, FaUserFriends, FaRegCommentDots, FaLaptopCode,
  FaServer, FaRobot, FaMobileAlt, FaBriefcase
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Custom styles for Deep Cosmos theme
const deepCosmosStyles = `
  .bg-deep-cosmos-primary { background-color: #1A1A2E; }
  .bg-deep-cosmos-secondary { background-color: #25253A; }
  .text-deep-cosmos-white { color: #FFFFFF; }
  .text-deep-cosmos-light-grey { color: #F0F0F0; }
  .text-deep-cosmos-teal { color: #5DE0E6; }
  .bg-deep-cosmos-teal { background-color: #5DE0E6; }
  .bg-deep-cosmos-gold { background-color: #FFA500; }
  .text-deep-cosmos-gold { color: #FFA500; }
  .bg-deep-cosmos-magenta { background-color: #C77DFF; }
  .text-deep-cosmos-magenta { color: #C77DFF; }
  .border-deep-cosmos-grey { border-color: #404050; }
`;

const Navbar = () => {
  const { user, logout } = useAuth(); // Use 'user' instead of 'currentUser'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileDropdownOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationDropdownOpen(false);
      if (messageRef.current && !messageRef.current.contains(event.target)) setIsMessageDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsMessageDropdownOpen(false);
  }, [location.pathname]);

  const [notifications] = useState([
    { id: 1, icon: <FaThumbsUp className="text-deep-cosmos-teal text-xl" />, text: "John liked your post", time: "5 min ago", read: false, link: "/notifications" },
    { id: 2, icon: <FaComment className="text-deep-cosmos-teal text-xl" />, text: "Sarah commented on your project", time: "2 hours ago", read: false, link: "/notifications" },
    { id: 3, icon: <FaUserFriends className="text-deep-cosmos-magenta text-xl" />, text: "3 new connection requests", time: "1 day ago", read: true, link: "/notifications" },
  ]);

  const [messages] = useState([
    { id: 1, avatar: <FaUserCircle className="text-deep-cosmos-light-grey text-2xl" />, name: "Alex Johnson", preview: "Hey, about our project meeting tomorrow...", time: "10:30 AM", unread: true, link: "/chat" },
    { id: 2, avatar: <FaUserCircle className="text-deep-cosmos-light-grey text-2xl" />, name: "Team DevConnect", preview: "Weekly newsletter: New features released!", time: "Yesterday", unread: false, link: "/chat" },
  ]);

  const developerCategories = [
    { id: 1, icon: <FaLaptopCode className="text-deep-cosmos-teal text-lg" />, name: "Frontend", link: "/all-developers?category=frontend" },
    { id: 2, icon: <FaServer className="text-deep-cosmos-teal text-lg" />, name: "Backend", link: "/all-developers?category=backend" },
    { id: 3, icon: <FaLaptopCode className="text-deep-cosmos-teal text-lg" />, name: "Full Stack", link: "/all-developers?category=fullstack" },
    { id: 4, icon: <FaRobot className="text-deep-cosmos-gold text-lg" />, name: "AI/ML", link: "/all-developers?category=ai" },
    { id: 5, icon: <FaMobileAlt className="text-deep-cosmos-magenta text-lg" />, name: "Mobile Devs", link: "/all-developers?category=mobile" },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  const toggleDropdown = (e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); setIsProfileDropdownOpen(false); setIsNotificationDropdownOpen(false); setIsMessageDropdownOpen(false); };
  const toggleProfileDropdown = (e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsDropdownOpen(false); setIsNotificationDropdownOpen(false); setIsMessageDropdownOpen(false); };
  const toggleNotificationDropdown = (e) => { e.stopPropagation(); setIsNotificationDropdownOpen(!isNotificationDropdownOpen); setIsDropdownOpen(false); setIsProfileDropdownOpen(false); setIsMessageDropdownOpen(false); };
  const toggleMessageDropdown = (e) => { e.stopPropagation(); setIsMessageDropdownOpen(!isMessageDropdownOpen); setIsDropdownOpen(false); setIsProfileDropdownOpen(false); setIsNotificationDropdownOpen(false); };
  const toggleMobileMenu = (e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <style>{deepCosmosStyles}</style>
      <nav className="bg-deep-cosmos-primary shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center hover:text-deep-cosmos-teal transition-all" onClick={scrollToTop}>
                <img className="h-12 md:h-14 border border-deep-cosmos-grey rounded-sm shadow-sm" src={assets.logo} alt="Devconnect" />
                <span className="ml-3 text-2xl font-bold text-deep-cosmos-white hidden sm:inline">DevConnect</span>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <Link to="/" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-2 rounded-md text-sm font-medium" onClick={scrollToTop}>
                  <FaHome className="mr-2" />Home
                </Link>

                {/* Developers Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-2 rounded-md text-sm font-medium">
                    <FaSearch className="mr-2" />Explore Developers
                    {isDropdownOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-deep-cosmos-secondary rounded-lg shadow-xl py-2 z-50 border border-deep-cosmos-grey">
                      <Link to="/all-developers" className="flex items-center px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => setIsDropdownOpen(false)}>
                        <FaUserFriends className="mr-3 text-deep-cosmos-light-grey" />All Developers
                      </Link>
                      {developerCategories.map(category => (
                        <Link key={category.id} to={category.link} className="flex items-center px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => setIsDropdownOpen(false)}>
                          {category.icon}<span className="ml-3">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Projects/Showcase Link */}
                <Link to="/projects" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-2 rounded-md text-sm font-medium">
                  <FaCode className="mr-2" />Projects
                </Link>

                {/* Jobs/Opportunities Link */}
                <Link to="/jobs" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-2 rounded-md text-sm font-medium">
                  <FaBriefcase className="mr-2" />Jobs
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  {/* Notification Dropdown */}
                  <div className="relative hidden md:block" ref={notificationRef}>
                    <button onClick={toggleNotificationDropdown} className="p-2 rounded-full text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all relative">
                      <IoMdNotificationsOutline className="text-xl" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-deep-cosmos-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                    {isNotificationDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-red-600 rounded-lg shadow-xl py-1 z-50 border border-deep-cosmos-grey">
                        <div className="px-4 py-3 border-b border-deep-cosmos-grey flex justify-between items-center bg-deep-cosmos-primary rounded-t-lg">
                          <h3 className="font-semibold text-deep-cosmos-white">Notifications</h3>
                          <Link to="/notifications" className="text-sm text-deep-cosmos-teal hover:text-deep-cosmos-teal transition-all" onClick={() => setIsNotificationDropdownOpen(false)}>View All</Link>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <Link key={notification.id} to={notification.link} className={`flex items-start px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all ${!notification.read ? 'bg-deep-cosmos-teal/20' : ''}`} onClick={() => setIsNotificationDropdownOpen(false)}>
                              <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-deep-cosmos-white">{notification.text}</p>
                                <p className="text-xs text-deep-cosmos-light-grey">{notification.time}</p>
                              </div>
                              {!notification.read && <div className="ml-2 w-2 h-2 bg-deep-cosmos-teal rounded-full"></div>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages Dropdown */}
                  <div className="relative hidden md:block" ref={messageRef}>
                    <button onClick={toggleMessageDropdown} className="p-2 rounded-full text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all relative">
                      <BsFillChatDotsFill className="text-xl" />
                      {unreadMessages > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-deep-cosmos-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </button>
                    {isMessageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-deep-cosmos-secondary rounded-lg shadow-xl py-1 z-50 border border-deep-cosmos-grey">
                        <div className="px-4 py-3 border-b border-deep-cosmos-grey flex justify-between items-center bg-deep-cosmos-primary rounded-t-lg">
                          <h3 className="font-semibold text-deep-cosmos-white">Messages</h3>
                          <Link to="/chat" className="text-sm text-deep-cosmos-teal hover:text-deep-cosmos-teal transition-all" onClick={() => setIsMessageDropdownOpen(false)}>View All</Link>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {messages.map(message => (
                            <Link key={message.id} to={message.link} className={`flex items-start px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all ${message.unread ? 'bg-deep-cosmos-teal/20' : ''}`} onClick={() => setIsMessageDropdownOpen(false)}>
                              <div className="flex-shrink-0">{message.avatar}</div>
                              <div className="ml-3 flex-1 overflow-hidden">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium text-deep-cosmos-white truncate">{message.name}</p>
                                  <p className="text-xs text-deep-cosmos-light-grey">{message.time}</p>
                                </div>
                                <p className="text-sm text-deep-cosmos-light-grey truncate">{message.preview}</p>
                              </div>
                              {message.unread && <div className="ml-2 w-2 h-2 bg-deep-cosmos-teal rounded-full"></div>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button onClick={toggleProfileDropdown} className="flex items-center p-1 rounded-full hover:text-deep-cosmos-teal transition-all">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-deep-cosmos-teal to-deep-cosmos-magenta flex items-center justify-center overflow-hidden">
                        <FaUserCircle className="text-deep-cosmos-white text-2xl" />
                      </div>
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-deep-cosmos-secondary rounded-lg shadow-xl py-2 z-50 border border-deep-cosmos-grey">
                        <Link to="/my-profile" className="flex items-center px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                          <FaUserCircle className="mr-3 text-deep-cosmos-light-grey" />Profile
                        </Link>
                        <Link to="/edit-profile" className="flex items-center px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                          <FaCog className="mr-3 text-deep-cosmos-light-grey" />Edit Profile
                        </Link>
                        <Link to="/my-profile" className="flex items-center px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => setIsProfileDropdownOpen(false)}>
                          <FaUserFriends className="mr-3 text-deep-cosmos-light-grey" />My Network
                        </Link>
                        <div className="border-t border-deep-cosmos-grey my-1"></div>
                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all">
                          <FaSignOutAlt className="mr-3 text-deep-cosmos-light-grey" />Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <Link to="/login" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-2 rounded-md text-sm font-medium">
                      <FaUser className="mr-2" />Login
                    </Link>
                    <Link to="/register" className="bg-white text-deep-cosmos-primary px-4 py-2 rounded-md hover:text-deep-cosmos-teal transition-all flex items-center text-sm font-medium">
                      <FaUserPlus className="mr-2" />Register
                    </Link>
                  </div>
                </>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="p-2 rounded-md text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-deep-cosmos-secondary border-t border-deep-cosmos-grey shadow-lg">
            <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Main Navigation */}
              <Link to="/" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => { scrollToTop(); setIsMobileMenuOpen(false); }}>
                <FaHome className="mr-3 text-lg" />Home
              </Link>

              {/* Developers Dropdown */}
              <div className="space-y-1">
                <button onClick={toggleDropdown} className="flex items-center justify-between w-full text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium">
                  <div className="flex items-center">
                    <FaSearch className="mr-3 text-lg" />Explore Developers
                  </div>
                  {isDropdownOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                </button>
                {isDropdownOpen && (
                  <div className="ml-6 space-y-1 bg-deep-cosmos-primary rounded-md py-2">
                    <Link to="/all-developers" className="block px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}>All Developers</Link>
                    {developerCategories.map(category => (
                      <Link key={category.id} to={category.link} className="block px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all" onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}>{category.name}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Link */}
              <Link to="/projects" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <FaCode className="mr-3 text-lg" />Projects
              </Link>

              {/* Jobs Link */}
              <Link to="/jobs" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <FaBriefcase className="mr-3 text-lg" />Jobs
              </Link>

              {/* User-specific sections */}
              {user ? (
                <>
                  <div className="border-t border-deep-cosmos-grey pt-3 mt-4 space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-deep-cosmos-light-grey uppercase tracking-wider">Account</div>
                    <Link to="/notifications" className="flex items-center justify-between text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center">
                        <IoMdNotificationsOutline className="mr-3 text-lg" />Notifications
                      </div>
                      {unreadNotifications > 0 && <span className="bg-deep-cosmos-magenta text-deep-cosmos-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadNotifications}</span>}
                    </Link>
                    <Link to="/chat" className="flex items-center justify-between text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center">
                        <BsFillChatDotsFill className="mr-3 text-lg" />Messages
                      </div>
                      {unreadMessages > 0 && <span className="bg-deep-cosmos-gold text-deep-cosmos-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadMessages}</span>}
                    </Link>
                    <Link to="/my-profile" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <FaUserCircle className="mr-3 text-lg" />Profile
                    </Link>
                    <Link to="/edit-profile" className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <FaCog className="mr-3 text-lg" />Edit Profile
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal transition-all px-3 py-3 rounded-md text-base font-medium">
                      <FaSignOutAlt className="mr-3 text-lg" />Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-deep-cosmos-grey pt-4 mt-4 space-y-3">
                  <div className="px-3 py-2 text-xs font-semibold text-deep-cosmos-light-grey uppercase tracking-wider">Get Started</div>
                  <Link to="/login" className="flex items-center justify-center bg-deep-cosmos-primary text-deep-cosmos-teal px-4 py-3 rounded-lg text-base font-medium hover:text-deep-cosmos-teal transition-all mx-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaUser className="mr-3" />Login
                  </Link>
                  <Link to="/register" className="flex items-center justify-center bg-white text-deep-cosmos-primary px-4 py-3 rounded-lg text-base font-medium hover:text-deep-cosmos-teal transition-all mx-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaUserPlus className="mr-3" />Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;