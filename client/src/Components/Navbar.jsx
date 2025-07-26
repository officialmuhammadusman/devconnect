import { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import {
  FaHome, FaSearch, FaUser, FaUserPlus, FaChevronDown, FaChevronUp,
  FaCog, FaSignOutAlt, FaUserCircle, FaCode,
  FaThumbsUp, FaComment, FaUserFriends, FaRegCommentDots, FaLaptopCode,
  FaServer, FaRobot, FaMobileAlt, FaBriefcase, FaRss, FaShare
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socket, connectSocket } from '../utils/socket';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const styles = `
  .bg-primary { background-color: #f8fafc; }
  .bg-secondary { background-color: #ffffff; }
  .text-primary { color: #1e293b; }
  .text-secondary { color: #475569; }
  .text-accent { color: #2563eb; }
  .bg-accent { background-color: #2563eb; }
  .bg-accent-hover { background-color: #1d4ed8; }
  .border-grey { border-color: #e5e7eb; }
  .navbar-first { padding: 0.5rem 1rem; }
  .navbar-second { padding: 0.5rem 1rem; }
  .navbar-link:hover, .navbar-button:hover { background-color: #f1f5f9; border-radius: 4px; }
  .navbar-link.active { background-color: #dbeafe; border-radius: 4px; }
  .drawer { 
    position: fixed; 
    top: 0; 
    left: 0; 
    height: 100%; 
    width: 80%; 
    max-width: 300px; 
    background-color: #ffffff; 
    transform: translateX(-100%); 
    transition: transform 0.3s ease-in-out; 
    z-index: 1000; 
    border-right: 1px solid #e5e7eb; 
  }
  .drawer.open { 
    transform: translateX(0); 
  }
  .drawer-overlay { 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background-color: rgba(0, 0, 0, 0.5); 
    z-index: 999; 
    display: none; 
  }
  .drawer-overlay.open { 
    display: block; 
  }
  @media (max-width: 768px) {
    .navbar-second .navbar-menu { display: none; }
  }
`;

const Navbar = () => {
  const { user, logout, notifications, chats, getNotifications, getChats, markAllNotificationsRead, markNotificationRead, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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
    if (user && !loading) {
      if (!notifications.length) {
        getNotifications().catch(error => console.error('Failed to fetch notifications:', error));
      }
      if (!chats.length) {
        getChats().catch(error => console.error('Failed to fetch chats:', error));
      }
    }
  }, [user, notifications.length, chats.length, getNotifications, getChats, loading]);

  useEffect(() => {
    if (!user) return;

    const setupSocket = async () => {
      try {
        await connectSocket();
        socket.on('notification', (notification) => {
          if (notification.userId === user._id) {
            getNotifications().catch(error => console.error('Failed to fetch notifications:', error));
          }
        });
        socket.on('message', (message) => {
          if (message.senderId !== user._id) {
            console.log('New message received, refreshing chats and notifications:', message);
            getChats().catch(error => console.error('Failed to fetch chats:', error));
            getNotifications().catch(error => console.error('Failed to fetch notifications:', error));
          }
        });
        socket.on('notifications_read', () => {
          getNotifications().catch(error => console.error('Failed to fetch notifications:', error));
        });
        socket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error.message);
        });
      } catch (error) {
        console.error('Failed to connect Socket.IO:', error);
      }
    };

    setupSocket();

    return () => {
      socket.off('notification');
      socket.off('message');
      socket.off('notifications_read');
      socket.off('connect_error');
    };
  }, [user, getNotifications, getChats]);

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
    setIsMobileDrawerOpen(false);
    setIsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsMessageDropdownOpen(false);
  }, [location.pathname]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = chats.reduce((count, chat) => {
    const otherParticipant = chat.participants.find(p => p._id !== user?._id);
    const unreadFromNotifications = notifications.some(n => n.type === 'message' && !n.isRead && n.senderId === otherParticipant?._id);
    const unreadFromChat = chat.unreadCount ? chat.unreadCount : 0;
    return count + (unreadFromChat > 0 ? unreadFromChat : (unreadFromNotifications ? 1 : 0));
  }, 0);

  const developerCategories = [
    { id: 1, icon: <FaLaptopCode className="text-accent text-lg" />, name: "Frontend", link: "/all-developers?category=frontend" },
    { id: 2, icon: <FaServer className="text-accent text-lg" />, name: "Backend", link: "/all-developers?category=backend" },
    { id: 3, icon: <FaLaptopCode className="text-accent text-lg" />, name: "Full Stack", link: "/all-developers?category=fullstack" },
    { id: 4, icon: <FaRobot className="text-accent text-lg" />, name: "AI/ML", link: "/all-developers?category=ai" },
    { id: 5, icon: <FaMobileAlt className="text-accent text-lg" />, name: "Mobile Devs", link: "/all-developers?category=mobile" },
  ];

  const toggleDropdown = (e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); setIsProfileDropdownOpen(false); setIsNotificationDropdownOpen(false); setIsMessageDropdownOpen(false); };
  const toggleProfileDropdown = (e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsDropdownOpen(false); setIsNotificationDropdownOpen(false); setIsMessageDropdownOpen(false); };
  const toggleNotificationDropdown = (e) => { e.stopPropagation(); setIsNotificationDropdownOpen(!isNotificationDropdownOpen); setIsDropdownOpen(false); setIsProfileDropdownOpen(false); setIsMessageDropdownOpen(false); };
  const toggleMessageDropdown = (e) => { e.stopPropagation(); setIsMessageDropdownOpen(!isMessageDropdownOpen); setIsDropdownOpen(false); setIsProfileDropdownOpen(false); setIsNotificationDropdownOpen(false); };
  const toggleMobileDrawer = (e) => { e.stopPropagation(); setIsMobileDrawerOpen(!isMobileDrawerOpen); };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      setIsMobileDrawerOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const result = await markAllNotificationsRead();
      if (result.success) {
        setIsNotificationDropdownOpen(false);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="bg-primary shadow-md sticky top-0 z-50 navbar-first">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center hover:text-accent transition-all" onClick={scrollToTop}>
              <img className="h-10 md:h-12 border border-grey rounded-sm shadow-sm" src={assets.logo} alt="DevConnect" />
              <span className="ml-3 text-xl font-semibold text-primary hidden sm:inline">DevConnect</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center p-1 rounded-full hover:text-accent transition-all"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                    <FaUserCircle className="text-white text-xl" />
                  </div>
                  <span className="ml-2 text-primary hidden md:inline">{user.fullName || 'User'}</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-md py-2 z-50 border border-grey">
                    <Link
                      to={`/my-profile/${user._id}`}
                      className="flex items-center px-4 py-2 text-secondary hover:text-accent transition-all"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FaUserCircle className="mr-2" /> Profile
                    </Link>
                    <Link
                      to="/edit-profile"
                      className="flex items-center px-4 py-2 text-secondary hover:text-accent transition-all"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FaCog className="mr-2" /> Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-secondary hover:text-accent transition-all"
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
                  className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  <FaUser className="mr-2" /> Login
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover transition-all text-sm font-medium navbar-link ${location.pathname === '/register' ? 'active' : ''}`}
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <nav className="bg-secondary shadow-md navbar-second">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <ul className="hidden md:flex navbar-menu space-x-6">
              <li>
                <Link
                  to="/"
                  className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={scrollToTop}
                >
                  <FaHome className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/projects' ? 'active' : ''}`}
                >
                  <FaCode className="mr-2" /> Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/jobs' ? 'active' : ''}`}
                >
                  <FaBriefcase className="mr-2" /> Jobs
                </Link>
              </li>
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-button"
                >
                  <FaSearch className="mr-2" /> Developers {isDropdownOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-secondary rounded-lg shadow-md py-2 z-50 border border-grey">
                    <Link
                      to="/all-developers"
                      className="flex items-center px-4 py-2 text-secondary hover:text-accent"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserFriends className="mr-2" /> All Developers
                    </Link>
                    {developerCategories.map(category => (
                      <Link
                        key={category.id}
                        to={category.link}
                        className="flex items-center px-4 py-2 text-secondary hover:text-accent"
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
                      className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/feed' ? 'active' : ''}`}
                    >
                      <FaRss className="mr-2" /> Feed
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/create-post"
                      className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/create-post' ? 'active' : ''}`}
                    >
                      <FaRegCommentDots className="mr-2" /> Create Post
                    </Link>
                  </li>
                  <li className="relative" ref={notificationRef}>
                    <button
                      onClick={toggleNotificationDropdown}
                      className="flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-button relative"
                    >
                      <IoMdNotificationsOutline className="mr-2" />
                      Notifications
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                    {isNotificationDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-secondary rounded-lg shadow-md py-2 z-50 border border-grey">
                        <div className="px-4 py-2 border-b border-grey flex justify-between items-center bg-primary rounded-t-lg">
                          <h3 className="font-semibold text-primary">Notifications</h3>
                          <div className="flex space-x-2">
                            {unreadNotificationsCount > 0 && (
                              <button
                                onClick={handleMarkAllNotificationsRead}
                                className="text-sm text-accent hover:text-accent-hover"
                              >
                                Mark All as Read
                              </button>
                            )}
                            <Link to="/notifications" className="text-sm text-accent" onClick={() => setIsNotificationDropdownOpen(false)}>
                              View All
                            </Link>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {unreadNotificationsCount === 0 ? (
                            <p className="p-4 text-secondary text-center text-sm">No new notifications.</p>
                          ) : (
                            notifications.filter(n => !n.isRead).slice(0, 5).map(notification => (
                              <Link
                                key={notification._id}
                                to="/notifications"
                                className={`flex items-start px-4 py-2 text-secondary hover:text-accent ${!notification.isRead ? 'bg-accent/10' : ''}`}
                                onClick={async () => {
                                  setIsNotificationDropdownOpen(false);
                                  await markNotificationRead(notification._id);
                                }}
                              >
                                <div className="flex-shrink-0 mt-1">
                                  {notification.type === 'like' && <FaThumbsUp className="text-accent text-xl" />}
                                  {notification.type === 'comment' && <FaComment className="text-accent text-xl" />}
                                  {notification.type === 'share' && <FaShare className="text-accent text-xl" />}
                                  {notification.type === 'follow' && <FaUserFriends className="text-accent text-xl" />}
                                  {notification.type === 'message' && <BsFillChatDotsFill className="text-accent text-xl" />}
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-primary">{notification.message}</p>
                                  <p className="text-xs text-secondary">{dayjs(notification.createdAt).fromNow()}</p>
                                </div>
                                {!notification.isRead && <div className="ml-2 w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>}
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                  <li className="relative" ref={messageRef}>
                    <button
                      onClick={toggleMessageDropdown}
                      className="flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-button relative"
                    >
                      <BsFillChatDotsFill className="mr-2" />
                      Messages
                      {unreadMessagesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </button>
                    {isMessageDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-secondary rounded-lg shadow-md py-2 z-50 border border-grey">
                        <div className="px-4 py-2 border-b border-grey flex justify-between items-center bg-primary rounded-t-lg">
                          <h3 className="font-semibold text-primary">Messages</h3>
                          <Link to="/chat" className="text-sm text-accent" onClick={() => setIsMessageDropdownOpen(false)}>
                            View All
                          </Link>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {unreadMessagesCount === 0 && chats.length === 0 ? (
                            <p className="p-4 text-secondary text-center text-sm">No new messages.</p>
                          ) : (
                            chats.slice(0, 5).map(chat => {
                              const otherParticipant = chat.participants?.find(p => p._id !== user?._id);
                              const hasUnread = notifications.some(n => n.type === 'message' && !n.isRead && n.senderId === otherParticipant?._id);
                              const unreadFromChat = chat.unreadCount ? chat.unreadCount : 0;
                              const lastMessagePreview = chat.lastMessage?.content ?
                                `${chat.lastMessage.senderId === user?._id ? 'You: ' : ''}${chat.lastMessage.content.substring(0, 30)}${chat.lastMessage.content.length > 30 ? '...' : ''}`
                                : "No messages yet";

                              return (
                                <Link
                                  key={chat._id}
                                  to={`/chat/${chat._id}`}
                                  className={`flex items-start px-4 py-2 text-secondary hover:text-accent ${(unreadFromChat > 0 || hasUnread) ? 'bg-accent/10' : ''}`}
                                  onClick={() => setIsMessageDropdownOpen(false)}
                                >
                                  <div className="flex-shrink-0 mt-1">
                                    {otherParticipant?.profileImage ? (
                                      <img
                                        src={otherParticipant.profileImage}
                                        alt={otherParticipant.fullName}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `https://placehold.co/32x32/64748b/ffffff?text=${otherParticipant.fullName?.[0] || '?'}`;
                                        }}
                                      />
                                    ) : (
                                      <FaUserCircle className="text-secondary text-2xl" />
                                    )}
                                  </div>
                                  <div className="ml-3 flex-1 overflow-hidden">
                                    <div className="flex justify-between">
                                      < p className="text-sm font-medium text-primary truncate">{otherParticipant?.fullName || "Unknown User"}</p>
                                      <p className="text-xs text-secondary">{chat.lastMessage?.createdAt && dayjs(chat.lastMessage.createdAt).fromNow()}</p>
                                    </div>
                                    <p className="text-sm text-secondary truncate">{lastMessagePreview}</p>
                                  </div>
                                  {(unreadFromChat > 0 || hasUnread) && <div className="ml-2 w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>}
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                  <li>
                    <Link
                      to="/all-users"
                      className={`flex items-center text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium navbar-link ${location.pathname === '/all-users' ? 'active' : ''}`}
                    >
                      <FaUserFriends className="mr-2" /> Users
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className="md:hidden">
              <button
                onClick={toggleMobileDrawer}
                className="p-2 rounded-md text-primary hover:text-accent"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileDrawerOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`drawer-overlay ${isMobileDrawerOpen ? 'open' : ''}`} onClick={toggleMobileDrawer}></div>
      <div className={`drawer ${isMobileDrawerOpen ? 'open' : ''}`}>
        <div className="flex justify-between items-center p-4 bg-primary border-b border-grey">
          <span className="text-xl font-semibold text-primary">Menu</span>
          <button
            onClick={toggleMobileDrawer}
            className="p-2 text-primary hover:text-accent"
            aria-label="Close drawer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
              onClick={() => { scrollToTop(); setIsMobileDrawerOpen(false); }}
            >
              <FaHome className="mr-2" /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              <FaCode className="mr-2" /> Projects
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              <FaBriefcase className="mr-2" /> Jobs
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full text-primary hover:text-accent px-4 py-2 text-base font-medium"
            >
              <span><FaSearch className="inline mr-2" /> Developers</span>
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isDropdownOpen && (
              <div className="ml-4 bg-primary rounded-md py-2">
                <Link
                  to="/all-developers"
                  className="block px-4 py-2 text-secondary hover:text-accent"
                  onClick={() => { setIsDropdownOpen(false); setIsMobileDrawerOpen(false); }}
                >
                  All Developers
                </Link>
                {developerCategories.map(category => (
                  <Link
                    key={category.id}
                    to={category.link}
                    className="block px-4 py-2 text-secondary hover:text-accent"
                    onClick={() => { setIsDropdownOpen(false); setIsMobileDrawerOpen(false); }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          {!user && (
            <>
              <li>
                <Link
                  to="/login"
                  className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaUser className="mr-2" /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover transition-all text-base font-medium"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link
                  to="/feed"
                  className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaRss className="mr-2" /> Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/create-post"
                  className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaRegCommentDots className="mr-2" /> Create Post
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium relative"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <IoMdNotificationsOutline className="mr-2" />
                  Notifications
                  {unreadNotificationsCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium relative"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <BsFillChatDotsFill className="mr-2" />
                  Messages
                  {unreadMessagesCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/all-users"
                  className="flex items-center text-primary hover:text-accent px-4 py-2 text-base font-medium"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <FaUserFriends className="mr-2" /> Users
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;