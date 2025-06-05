import React, { useState, useEffect } from 'react';
import {
  FaInstagram, FaTwitter, FaGithub, FaEnvelope, FaHome, FaLock, FaUserPlus,
  FaUsers, FaRocket, FaCodeBranch, FaBriefcase, FaComments,
  FaBell, FaBrain, FaGavel, FaExclamationTriangle, FaFileContract, FaChevronUp,
  FaGoogle, FaFacebookMessenger, FaCogs, FaQuestionCircle, FaUserShield, FaThumbsUp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Function to open chat, e.g. opens chat modal or navigates after login
  const openChat = () => {
    // For now, just alert or you can replace with actual logic
    alert('Open chat window (requires login)');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-10 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="flex items-center gap-2 hover:text-white"><FaHome /> Home</Link></li>
            <li><Link to="/login" className="flex items-center gap-2 hover:text-white"><FaLock /> Login</Link></li>
            <li><Link to="/register" className="flex items-center gap-2 hover:text-white"><FaUserPlus /> Register</Link></li>
            <li><Link to="/all-developers" className="flex items-center gap-2 hover:text-white"><FaUsers /> Developers</Link></li>
            <li><button onClick={openChat} className="flex items-center gap-2 hover:text-white focus:outline-none">
              <FaComments /> Chat
            </button></li>
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/projects" className="flex items-center gap-2 hover:text-white"><FaCodeBranch /> Projects</Link></li>
            <li><Link to="/jobs" className="flex items-center gap-2 hover:text-white"><FaBriefcase /> Jobs</Link></li>
            <li><Link to="/notifications" className="flex items-center gap-2 hover:text-white"><FaBell /> Notifications</Link></li>
            <li><Link to="/edit-profile" className="flex items-center gap-2 hover:text-white"><FaBrain /> Edit Profile</Link></li>
          </ul>
        </div>

        {/* About + Legal */}
       <div>
  <h4 className="text-white font-semibold text-lg mb-4">Explore</h4>
  <ul className="space-y-2 text-sm">
    <li>
      <Link to="/#how-it-works" className="flex items-center gap-2 hover:text-white">
        <FaCogs /> How It Works
      </Link>
    </li>
    <li>
      <Link to="/#faq" className="flex items-center gap-2 hover:text-white">
        <FaQuestionCircle /> FAQs
      </Link>
    </li>
    <li>
      <Link to="/#trusted" className="flex items-center gap-2 hover:text-white">
        <FaUserShield /> Trusted by Developers
      </Link>
    </li>
    <li>
      <Link to="/#why-choose-us" className="flex items-center gap-2 hover:text-white">
        <FaThumbsUp /> Why Choose Us
      </Link>
    </li>
  </ul>
</div>


        {/* Connect */}
        <div>
          <h4 className="text-white font-semibold text-lg mb-4">Connect With Us</h4>
          <p className="text-sm flex items-center gap-2 mb-2">
            <FaEnvelope /> support@devconnect.com
          </p>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-white" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="hover:text-white" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-white" aria-label="GitHub"><FaGithub /></a>
            <a href="mailto:support@devconnect.com" className="hover:text-white" aria-label="Gmail"><FaGoogle /></a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
        © 2025 <span className="text-white font-semibold">DevConnect</span>. Built with 💖 using the <span className="text-purple-400 font-medium">MERN stack</span>. All rights reserved.
      </div>

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Back to Top"
        >
          <FaChevronUp />
        </button>
      )}

      {/* Floating Chat Icon */}
      <button
        onClick={openChat}
        aria-label="Open Chat"
        className="fixed bottom-6 right-6  bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all flex items-center justify-center"
      >
        <FaFacebookMessenger size={24} />
      </button>
    </footer>
  );
};

export default Footer;
