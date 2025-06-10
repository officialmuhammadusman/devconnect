import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaUserShield, FaUserFriends, FaEdit, FaRocket, FaUserPlus, FaMobileAlt } from "react-icons/fa";

const faqs = [
  {
    icon: <FaUserShield className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />,
    question: "Is DevConnect free to use?",
    answer: "Yes! DevConnect is completely free for developers. Sign up and start building your network today.",
  },
  {
    icon: <FaUserFriends className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />,
    question: "Who can join DevConnect?",
    answer: "Any developer, whether beginner or experienced, is welcome! All tech stacks, all levels.",
  },
  {
    icon: <FaRocket className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />,
    question: "What can I do after creating a profile?",
    answer: "You can post content, follow other developers, chat in real time, and showcase your skills.",
  },
  {
    icon: <FaEdit className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />,
    question: "Can I edit my profile later?",
    answer: "Absolutely! You can update your image, bio, skills, and social links any time under “Edit Profile.”",
  },
  {
    icon: <FaUserPlus className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />,
    question: "How do I connect with other developers?",
    answer: "Just visit their profile and follow them. You can also chat directly or engage through their posts.",
  },
  {
    icon: <FaMobileAlt className="w-5 h-5 text-cyan-400 mr-2 shrink-0" />,
    question: "Is there a mobile app for DevConnect?",
    answer: "Not yet — but we’re working on it! For now, enjoy full functionality on mobile browsers.",
  },
];

const FAQSSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="faq" className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Got Questions? We’ve Got Answers.
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Everything you need to know before joining the DevConnect community.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-700/30 backdrop-blur-lg rounded-xl p-5 border border-slate-600/30 hover:border-cyan-400/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  {faq.icon}
                  <span className="text-white font-semibold text-base md:text-lg">
                    {faq.question}
                  </span>
                </div>
                {activeIndex === index ? (
                  <FaChevronUp className="w-5 h-5 text-cyan-400" />
                ) : (
                  <FaChevronDown className="w-5 h-5 text-cyan-400" />
                )}
              </button>
              {activeIndex === index && (
                <div className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed pl-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSSection;