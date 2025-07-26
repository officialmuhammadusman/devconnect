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
    <section
      id="trusted"
      className="relative bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 text-slate-800">
          Trusted by Developers Worldwide
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Real stories from the DevConnect community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-600/50 hover:scale-105"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full mb-4 border-2 border-blue-600 shadow-md mx-auto"
              />
              <h3 className="text-slate-800 font-semibold text-lg mb-1 group-hover:text-blue-600">
                {t.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{t.role}</p>
              <p className="text-gray-700 text-sm italic leading-relaxed mb-4">
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
