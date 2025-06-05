import React from 'react';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Ali Raza',
    role: 'Frontend Engineer',
    quote:
      'I connected with devs who helped me refactor my code and landed freelance gigs too. DevConnect is 🔥',
    image: 'https://i.pravatar.cc/100?img=1',
  },
  {
    name: 'Sofia Kim',
    role: 'Full Stack Developer',
    quote:
      'Found a React mentor within 2 days. The networking and feedback loop are amazing!',
    image: 'https://i.pravatar.cc/100?img=2',
  },
  {
    name: 'Carlos Diaz',
    role: 'Backend Developer',
    quote:
      'Collaborating on open-source projects through DevConnect boosted my GitHub visibility!',
    image: 'https://i.pravatar.cc/100?img=3',
  },
];

const Testimonials = () => {
  return (
    <section id='trusted' className="bg-[#0f172a] text-white py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
         Trusted by Developers Worldwide
        </h2>
        <p className="text-gray-400 mb-16 text-lg">
          Real stories from the DevConnect community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Avatar */}
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full mb-4 border-2 border-purple-500 shadow-md"
              />

              {/* Name & Role */}
              <h3 className="text-white font-semibold text-lg">
                {t.name}
              </h3>
              <p className="text-sm text-purple-300 mb-4">{t.role}</p>

              {/* Testimonial */}
              <p className="text-gray-300 italic leading-relaxed mb-4">
                “{t.quote}”
              </p>

              {/* Optional Rating */}
              <div className="flex space-x-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
