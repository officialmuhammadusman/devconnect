import React, { useState, useEffect } from 'react'
import { Mail, Bell, Rocket, Code, Palette, Zap, Layers, GitBranch } from 'lucide-react'

const Projects = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 9,
    minutes: 47,
    seconds: 32
  })

  // Countdown timer
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/5 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/5 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating code symbols */}
      {['<>', '{}', '[]', '/>', '()', '&&', '||', '=='].map((symbol, i) => (
        <div
          key={i}
          className="absolute text-white/20 font-mono text-xl animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}
        >
          {symbol}
        </div>
      ))}

      <div className="relative mt-10 z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo/Brand */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300 hover:rotate-12">
            <Code className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            DevForge
          </h1>
          <p className="text-xl text-gray-300">Build. Create. Deploy.</p>
        </div>

        {/* Main heading */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Incredible
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Projects
            </span>
            Are Loading
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're crafting a revolutionary project showcase platform where creativity meets innovation. 
            Prepare to discover extraordinary digital experiences.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12 animate-fade-in-up">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center">
            <Rocket className="w-6 h-6 mr-2 text-blue-400" />
            Launch Countdown
          </h3>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:rotate-3">
                <div className="text-3xl font-bold text-blue-400">{value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-300 capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Layers, title: "Project Showcase", desc: "Beautiful portfolio displays", color: "from-blue-400 to-purple-500" },
            { icon: GitBranch, title: "Version Control", desc: "Track project evolution", color: "from-purple-400 to-pink-500" },
            { icon: Zap, title: "Live Demos", desc: "Interactive project previews", color: "from-yellow-400 to-orange-500" }
          ].map((feature, index) => (
            <div key={index} className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 hover:rotate-1">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Project Types Preview */}
        <div className="mb-12 animate-slide-in">
          <h3 className="text-2xl font-semibold text-white mb-6">What's Coming</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {['Web Apps', 'Mobile Apps', 'AI Projects', 'Games', 'APIs', 'Open Source'].map((type, index) => (
              <span
                key={type}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-blue-300 font-medium hover:scale-110 transition-transform duration-300 cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Email Signup */}
        <div className="mb-8 w-full max-w-md mx-auto animate-bounce-in">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get notified when we launch"
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span className="flex items-center justify-center">
                <Bell className="w-5 h-5 mr-2" />
                Join the Waitlist
              </span>
            </button>
          </div>
          
          {isSubmitted && (
            <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 animate-fade-in">
              🚀 Awesome! You'll be among the first to explore our projects.
            </div>
          )}
        </div>

        {/* Developer Community */}
        <div className="text-center animate-fade-in">
          <p className="text-gray-400 mb-4">Backed by 25,000+ developers worldwide</p>
          <div className="flex justify-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-mono text-sm transform hover:scale-110 transition-transform duration-200 hover:rotate-12">
                {['<', '>', '{', '}', '(', ')'][i]}
              </div>
            ))}
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs">
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Projects