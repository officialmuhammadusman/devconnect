import React, { useState, useEffect } from 'react'
import { Mail, Bell, Rocket, Code } from 'lucide-react'

const Projects = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 9,
    minutes: 47,
    seconds: 32
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="relative mt-10 z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-xl mb-4 shadow-md transform hover:scale-110 transition-transform duration-300">
            <Code className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-2">
            DevForge
          </h1>
          <p className="text-xl text-slate-600">Build. Create. Deploy.</p>
        </div>

        <div className="mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-6 leading-tight">
            Incredible
            <span className="block text-blue-600 animate-pulse">
              Projects
            </span>
            Are Loading
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're crafting a revolutionary project showcase platform where creativity meets innovation. 
            Prepare to discover extraordinary digital experiences.
          </p>
        </div>

        <div className="mb-12 animate-fade-in-up">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center justify-center">
            <Rocket className="w-6 h-6 mr-2 text-blue-600" />
            Launch Countdown
          </h3>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-slate-800">{value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-slate-600 capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Code, title: "Project Showcase", desc: "Beautiful portfolio displays", color: "blue-600" },
            { icon: Code, title: "Version Control", desc: "Track project evolution", color: "blue-600" },
            { icon: Code, title: "Live Demos", desc: "Interactive project previews", color: "blue-600" }
          ].map((feature, index) => (
            <div key={index} className="group bg-white rounded-xl p-6 border border-gray-200 hover:bg-gray-50 transition-all duration-500 transform hover:scale-105">
              <div className={`w-12 h-12 bg-${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h4>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-12 animate-slide-in">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">What's Coming</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {['Web Apps', 'Mobile Apps', 'AI Projects', 'Games', 'APIs', 'Open Source'].map((type, index) => (
              <span
                key={type}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-blue-600 font-medium hover:scale-110 transition-transform duration-300 cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8 w-full max-w-md mx-auto animate-bounce-in">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get notified when we launch"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
            >
              <span className="flex items-center justify-center">
                <Bell className="w-5 h-5 mr-2" />
                Join the Waitlist
              </span>
            </button>
          </div>
          
          {isSubmitted && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-200 rounded-xl text-blue-800 animate-fade-in">
              🚀 Awesome! You'll be among the first to explore our projects.
            </div>
          )}
        </div>

        <div className="text-center animate-fade-in">
          <p className="text-slate-600 mb-4">Backed by 25,000+ developers worldwide</p>
          <div className="flex justify-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-mono text-sm transform hover:scale-110 transition-transform duration-200">
                {['<', '>', '{', '}', '(', ')'][i]}
              </div>
            ))}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-slate-800 text-xs">
              +25K
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.4s both;
        }
        
        .animate-bounce-in {
          animation: bounce-in 1s ease-out 0.6s both;
        }
        
        .animate-slide-in {
          animation: slide-in 1s ease-out 0.5s both;
        }
      `}</style>
    </div>
  )
}

export default Projects