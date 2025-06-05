import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaUserShield, FaUserFriends, FaEdit, FaRocket, FaUserPlus, FaMobileAlt } from 'react-icons/fa';

const faqs = [
  {
    icon: <FaUserShield className="text-purple-400 text-xl mr-2 shrink-0" />,
    question: 'Is DevConnect free to use?',
    answer: 'Yes! DevConnect is completely free for developers. Sign up and start building your network today.',
  },
  {
    icon: <FaUserFriends className="text-purple-400 text-xl mr-2 shrink-0" />,
    question: 'Who can join DevConnect?',
    answer: 'Any developer, whether beginner or experienced, is welcome! All tech stacks, all levels.',
  },
  {
    icon: <FaRocket className="text-purple-400 text-xl mr-2 shrink-0" />,
    question: 'What can I do after creating a profile?',
    answer: 'You can post content, follow other developers, chat in real time, and showcase your skills.',
  },
  {
    icon: <FaEdit className="text-purple-400 text-xl mr-2 shrink-0" />,
    question: 'Can I edit my profile later?',
    answer: 'Absolutely! You can update your image, bio, skills, and social links any time under “Edit Profile.”',
  },
  {
    icon: <FaUserPlus className="text-purple-400 text-xl mr-2 shrink-0" />,
    question: 'How do I connect with other developers?',
    answer: 'Just visit their profile and follow them. You can also chat directly or engage through their posts.',
  },
  {
    icon: <FaMobileAlt className="text-purple-400 text-xl mr-2 shrink-0" />,
    question: 'Is there a mobile app for DevConnect?',
    answer: 'Not yet — but we’re working on it! For now, enjoy full functionality on mobile browsers.',
  },
];

const FAQSSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id='faq' className="bg-[#0f172a] text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Got Questions? We’ve Got Answers.
        </h2>
        <p className="text-gray-400 mb-12 text-lg">
          Everything you need to know before joining the DevConnect community.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-start">
                  {faq.icon}
                  <span className="text-white font-semibold text-base md:text-lg">
                    {faq.question}
                  </span>
                </div>
                {activeIndex === index ? (
                  <FaChevronUp className="text-purple-400" />
                ) : (
                  <FaChevronDown className="text-purple-400" />
                )}
              </button>
              {activeIndex === index && (
                <div className="mt-3 text-gray-300 text-sm md:text-base leading-relaxed pl-7">
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
