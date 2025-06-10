import React from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Ali Raza",
    role: "Frontend Engineer",
    quote: "I connected with devs who helped me refactor my code and landed freelance gigs too. DevConnect is 🔥",
    image: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Sofia Kim",
    role: "Full Stack Developer",
    quote: "Found a React mentor within 2 days. The networking and feedback loop are amazing!",
    image: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Carlos Diaz",
    role: "Backend Developer",
    quote: "Collaborating on open-source projects through DevConnect boosted my GitHub visibility!",
    image: "https://i.pravatar.cc/100?img=3",
  },
];

const Testimonials = () => {
  return (
    <section id="trusted" className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Trusted by Developers Worldwide
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Real stories from the DevConnect community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group bg-slate-700/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full mb-4 border-2 border-cyan-400 shadow-md mx-auto"
              />
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                {t.name}
              </h3>
              <p className="text-sm text-slate-300 mb-4">{t.role}</p>
              <p className="text-slate-300 text-sm italic leading-relaxed mb-4">
                “{t.quote}”
              </p>
              <div className="flex justify-center space-x-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4" />
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