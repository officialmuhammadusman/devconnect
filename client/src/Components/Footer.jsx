import React, { useState, useEffect } from 'react';
import {
  FaInstagram, FaTwitter, FaGithub, FaEnvelope, FaHome, FaLock, FaUserPlus,
  FaUsers, FaCodeBranch, FaBriefcase, FaComments,
  FaBell, FaBrain, FaGavel, FaExclamationTriangle, FaFileContract, FaChevronUp,
  FaGoogle, FaCogs, FaQuestionCircle, FaUserShield, FaThumbsUp
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Footer = () => {
  const [showTop, setShowTop] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const openChat = () => {
    if (user) {
      navigate('/chat');
    } else {
      toast.info("Please login to access chat.");
      navigate("/login");
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-600 pt-16 pb-10 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

        <div>
          <h4 className="text-gray-800 font-semibold text-lg mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="flex items-center gap-2 hover:text-gray-800"><FaHome /> Home</Link></li>
            <li><Link to="/login" className="flex items-center gap-2 hover:text-gray-800"><FaLock /> Login</Link></li>
            <li><Link to="/register" className="flex items-center gap-2 hover:text-gray-800"><FaUserPlus /> Register</Link></li>
            <li><Link to="/all-developers" className="flex items-center gap-2 hover:text-gray-800"><FaUsers /> Developers</Link></li>
            <li>
              <button onClick={openChat} className="flex items-center gap-2 hover:text-gray-800 focus:outline-none">
                <FaComments /> Chat
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-800 font-semibold text-lg mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/projects" className="flex items-center gap-2 hover:text-gray-800"><FaCodeBranch /> Projects</Link></li>
            <li><Link to="/jobs" className="flex items-center gap-2 hover:text-gray-800"><FaBriefcase /> Jobs</Link></li>
            <li><Link to="/notifications" className="flex items-center gap-2 hover:text-gray-800"><FaBell /> Notifications</Link></li>
            <li><Link to="/edit-profile" className="flex items-center gap-2 hover:text-gray-800"><FaBrain /> Edit Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-800 font-semibold text-lg mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/#how-it-works" className="flex items-center gap-2 hover:text-gray-800">
                <FaCogs /> How It Works
              </Link>
            </li>
            <li>
              <Link to="/#faq" className="flex items-center gap-2 hover:text-gray-800">
                <FaQuestionCircle /> FAQs
              </Link>
            </li>
            <li>
              <Link to="/#trusted" className="flex items-center gap-2 hover:text-gray-800">
                <FaUserShield /> Trusted by Developers
              </Link>
            </li>
            <li>
              <Link to="/#why-choose-us" className="flex items-center gap-2 hover:text-gray-800">
                <FaThumbsUp /> Why Choose Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-800 font-semibold text-lg mb-4">Connect With Us</h4>
          <p className="text-sm flex items-center gap-2 mb-2">
            <FaEnvelope /> support@devconnect.com
          </p>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-gray-800" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="hover:text-gray-800" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-800" aria-label="GitHub"><FaGithub /></a>
            <a href="mailto:support@devconnect.com" className="hover:text-gray-800" aria-label="Gmail"><FaGoogle /></a>
          </div>
        </div>

      </div>

      <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        © 2025 <span className="text-gray-800 font-semibold">DevConnect</span>. Built with 💖 using the <span className="text-blue-600 font-medium">MERN stack</span>. All rights reserved.
      </div>

      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition-all"
          aria-label="Back to Top"
        >
          <FaChevronUp />
        </button>
      )}

      <button
        onClick={openChat}
        aria-label="Open Chat"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition-all flex items-center justify-center"
      >
        <FaComments size={24} />
      </button>
    </footer>
  );
};

export default Footer;