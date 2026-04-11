import { useNavigate } from "react-router-dom";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A] flex flex-col justify-between p-6 fixed inset-0 z-50">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-[#FC8019] opacity-0 animate-fade-in-up">
          <UtensilsCrossed className="w-8 h-8" />
          <span className="font-extrabold text-2xl tracking-tight text-white">BiteReel</span>
        </div>
        
        <div className="flex gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <button 
            onClick={() => navigate('/login')} 
            className="text-white/80 font-bold text-sm tracking-wide hover:text-white transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-white/10 text-white px-4 py-2 rounded-full font-bold text-sm tracking-wide hover:bg-white/20 transition-colors"
          >
            Register
          </button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-sm mx-auto">
        
        {/* Main Graphic/Icon */}
        <div className="w-32 h-32 bg-gradient-to-tr from-[#FC8019] to-[#E23744] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#FC8019]/20 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', transform: 'rotate(-10deg)' }}>
            <span className="text-6xl">🍕</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          Experience food like never before.
        </h1>
        <p className="text-gray-400 font-medium mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          Watch mouth-watering reels, explore nearby top brands, and order in seconds.
        </p>

        {/* Enter App Button */}
        <button 
          onClick={() => navigate('/home')}
          className="group bg-[#FC8019] text-white w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all opacity-0 animate-fade-in-up"
          style={{ animationDelay: '750ms' }}
        >
          Explore ReelBite
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}
