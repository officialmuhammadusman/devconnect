import { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import {
  FaHome, FaSearch, FaUser, FaUserPlus, FaChevronDown, FaChevronUp,
  FaBell, FaEnvelope, FaCog, FaSignOutAlt, FaUserCircle, FaCode,
  FaThumbsUp, FaComment, FaUserFriends, FaRegCommentDots, FaLaptopCode,
  FaServer, FaRobot, FaMobileAlt, FaBriefcase, FaRss
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
  .navbar-first { padding: 0.5rem 1rem; }
  .navbar-second { padding: 0.5rem 1rem; }
  .navbar-link:hover, .navbar-button:hover { background-color: #555; border-radius: 4px; }
  .navbar-link.active { background-color: #007bff; border-radius: 4px; }
  @media (max-width: 768px) {
    .navbar-second .navbar-menu { display: none; }
    .navbar-second .navbar-menu.open { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background-color: #25253A; padding: 1rem; z-index: 50; }
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
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

  // Mock data for notifications and messages (replace with API calls)
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
      
      {/* First Header: Logo and Login/Register or Profile */}
      <nav className="bg-deep-cosmos-primary shadow-md sticky top-0 z-50 navbar-first">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center hover:text-deep-cosmos-teal transition-all" onClick={scrollToTop}>
              <img className="h-10 md:h-12 border border-deep-cosmos-grey rounded-sm shadow-sm" src={assets.logo} alt="DevConnect" />
              <span className="ml-3 text-xl font-bold text-deep-cosmos-white hidden sm:inline">DevConnect</span>
            </Link>
          </div>

          {/* Right Side: Login/Register or Profile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center p-1 rounded-full hover:text-deep-cosmos-teal transition-all"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-deep-cosmos-teal to-deep-cosmos-magenta flex items-center justify-center overflow-hidden">
                    <FaUserCircle className="text-deep-cosmos-white text-xl" />
                  </div>
                  <span className="ml-2 text-deep-cosmos-white hidden md:inline">{user.fullName || 'User'}</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-deep-cosmos-secondary rounded-lg shadow-xl py-2 z-50 border border-deep-cosmos-grey">
                    <Link
                      to={`/my-profile/${user._id}`}
                      className="flex items-center px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FaUserCircle className="mr-2" /> Profile
                    </Link>
                    <Link
                      to="/edit-profile"
                      className="flex items-center px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FaCog className="mr-2" /> Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal transition-all"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link"
                >
                  <FaUser className="inline mr-1" /> Login
                </Link>
                <Link
                  to="/register"
                  className="bg-deep-cosmos-teal text-deep-cosmos-primary px-4 py-2 rounded-md hover:bg-deep-cosmos-gold transition-all text-sm font-medium navbar-link"
                >
                  <FaUserPlus className="inline mr-1" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Second Header: Main Navigation */}
      <nav className="bg-deep-cosmos-secondary shadow-md navbar-second">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Desktop Navigation */}
            <ul className="hidden md:flex navbar-menu space-x-6">
              <li>
                <Link
                  to="/"
                  className={`flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={scrollToTop}
                >
                  <FaHome className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className={`flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/projects' ? 'active' : ''}`}
                >
                  <FaCode className="mr-2" /> Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className={`flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/jobs' ? 'active' : ''}`}
                >
                  <FaBriefcase className="mr-2" /> Jobs
                </Link>
              </li>
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-button"
                >
                  <FaSearch className="mr-2" /> Developers {isDropdownOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-deep-cosmos-secondary rounded-lg shadow-xl py-2 z-50 border border-deep-cosmos-grey">
                    <Link
                      to="/all-developers"
                      className="flex items-center px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserFriends className="mr-2" /> All Developers
                    </Link>
                    {developerCategories.map(category => (
                      <Link
                        key={category.id}
                        to={category.link}
                        className="flex items-center px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {category.icon} <span className="ml-2">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              {user && (
                <>
                  <li>
                    <Link
                      to="/feed"
                      className={`flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/feed' ? 'active' : ''}`}
                    >
                      <FaRss className="mr-2" /> Feed
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/create-post"
                      className={`flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/create-post' ? 'active' : ''}`}
                    >
                      <FaRegCommentDots className="mr-2" /> Create Post
                    </Link>
                  </li>
                  <li className="relative" ref={notificationRef}>
                    <button
                      onClick={toggleNotificationDropdown}
                      className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-button relative"
                    >
                      <IoMdNotificationsOutline className="mr-2" />
                      Notifications
                      {unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                    {isNotificationDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-deep-cosmos-secondary rounded-lg shadow-xl py-2 z-50 border border-deep-cosmos-grey">
                        <div className="px-4 py-2 border-b border-deep-cosmos-grey flex justify-between items-center bg-deep-cosmos-primary rounded-t-lg">
                          <h3 className="font-semibold text-deep-cosmos-white">Notifications</h3>
                          <Link to="/notifications" className="text-sm text-deep-cosmos-teal" onClick={() => setIsNotificationDropdownOpen(false)}>
                            View All
                          </Link>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <Link
                              key={notification.id}
                              to={notification.link}
                              className={`flex items-start px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal ${!notification.read ? 'bg-deep-cosmos-teal/20' : ''}`}
                              onClick={() => setIsNotificationDropdownOpen(false)}
                            >
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
                  </li>
                  <li className="relative" ref={messageRef}>
                    <button
                      onClick={toggleMessageDropdown}
                      className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-button relative"
                    >
                      <BsFillChatDotsFill className="mr-2" />
                      Messages
                      {unreadMessages > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </button>
                    {isMessageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-deep-cosmos-secondary rounded-lg shadow-xl py-2 z-50 border border-deep-cosmos-grey">
                        <div className="px-4 py-2 border-b border-deep-cosmos-grey flex justify-between items-center bg-deep-cosmos-primary rounded-t-lg">
                          <h3 className="font-semibold text-deep-cosmos-white">Messages</h3>
                          <Link to="/chat" className="text-sm text-deep-cosmos-teal" onClick={() => setIsMessageDropdownOpen(false)}>
                            View All
                          </Link>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {messages.map(message => (
                            <Link
                              key={message.id}
                              to={message.link}
                              className={`flex items-start px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal ${message.unread ? 'bg-deep-cosmos-teal/20' : ''}`}
                              onClick={() => setIsMessageDropdownOpen(false)}
                            >
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
                  </li>
                  <li>
                    <Link
                      to="/all-users"
                      className={`flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/all-users' ? 'active' : ''}`}
                    >
                      <FaUserFriends className="mr-2" /> Users
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-deep-cosmos-white hover:text-deep-cosmos-teal"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <ul className="md:hidden navbar-menu open bg-deep-cosmos-secondary border-t border-deep-cosmos-grey shadow-lg">
              <li>
                <Link
                  to="/"
                  className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                  onClick={() => { scrollToTop(); setIsMobileMenuOpen(false); }}
                >
                  <FaHome className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaCode className="mr-2" /> Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaBriefcase className="mr-2" /> Jobs
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-between w-full text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                >
                  <span><FaSearch className="inline mr-2" /> Developers</span>
                  {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isDropdownOpen && (
                  <div className="ml-4 bg-deep-cosmos-primary rounded-md py-2">
                    <Link
                      to="/all-developers"
                      className="block px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal"
                      onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                    >
                      All Developers
                    </Link>
                    {developerCategories.map(category => (
                      <Link
                        key={category.id}
                        to={category.link}
                        className="block px-4 py-2 text-deep-cosmos-light-grey hover:text-deep-cosmos-teal"
                        onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              {user && (
                <>
                  <li>
                    <Link
                      to="/feed"
                      className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaRss className="mr-2" /> Feed
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/create-post"
                      className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaRegCommentDots className="mr-2" /> Create Post
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/notifications"
                      className="flex items-center justify-between text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <IoMdNotificationsOutline className="mr-2" /> Notifications
                      </div>
                      {unreadNotifications > 0 && (
                        <span className="bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadNotifications}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chat"
                      className="flex items-center justify-between text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <BsFillChatDotsFill className="mr-2" /> Messages
                      </div>
                      {unreadMessages > 0 && (
                        <span className="bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/all-users"
                      className="flex items-center text-deep-cosmos-white hover:text-deep-cosmos-teal px-4 py-2 text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUserFriends className="mr-2" /> Users
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;