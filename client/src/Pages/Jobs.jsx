import React, { useState, useEffect } from 'react'
import { Mail, Bell, Briefcase, Users, TrendingUp } from 'lucide-react'

const Jobs = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 15,
    minutes: 23,
    seconds: 45
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="relative z-10 mt-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo/Brand */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-md transform hover:scale-110 transition-transform duration-300">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-2">
            JobConnect
          </h1>
          <p className="text-xl text-slate-600">Find Your Dream Career</p>
        </div>

        {/* Main heading */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-6 leading-tight">
            Something
            <span className="block text-blue-600 animate-pulse">
              Amazing
            </span>
            is Coming
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We're crafting the ultimate job platform that connects talent with opportunity. 
            Get ready for a revolutionary career experience.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12 animate-fade-in-up">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">Launch Countdown</h3>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="bg-white rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-slate-800">{value.toString().padStart(2, '0')}</div>
                <div className="text-sm text-slate-600 capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Users, title: "Smart Matching", desc: "AI-powered job recommendations" },
            { icon: TrendingUp, title: "Career Growth", desc: "Track your professional journey" },
            { icon: Briefcase, title: "Premium Experience", desc: "Sleek, intuitive interface" }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h4>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Email Signup */}
        <div className="mb-8 w-full max-w-md mx-auto animate-bounce-in">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for early access"
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
                Notify Me at Launch
              </span>
            </button>
          </div>
          
          {isSubmitted && (
            <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-xl text-green-800 animate-fade-in">
              🎉 Thanks! You'll be the first to know when we launch.
            </div>
          )}
        </div>

        {/* Social proof */}
        <div className="text-center animate-fade-in">
          <p className="text-slate-600 mb-4">Join 50,000+ professionals already waiting</p>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm transform hover:scale-110 transition-transform duration-200">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-slate-800 text-xs">
              +50K
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  )
}

export default Jobs