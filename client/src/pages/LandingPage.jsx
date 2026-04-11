import { useNavigate } from "react-router-dom";
import { ArrowRight, Utensils } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A] flex flex-col justify-between p-6 fixed inset-0 z-50">
      
      {/* Top Header */}
      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center gap-2 text-[#FC8019]">
          <Utensils className="w-8 h-8" />
          <span className="font-extrabold text-2xl tracking-tight text-white">BiteReel</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-sm mx-auto">
        
        {/* Main Graphic/Icon */}
        <div className="w-32 h-32 bg-gradient-to-tr from-[#FC8019] to-[#E23744] rounded-[2rem] flex items-center justify-center shadow-lg shadow-[#FC8019]/20 mb-8" style={{ transform: 'rotate(-10deg)' }}>
            <span className="text-6xl">🍕</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
          Experience food like never before.
        </h1>
        <p className="text-gray-400 font-medium mb-10">
          Watch mouth-watering reels, explore nearby top brands, and order in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mt-2">
          <button 
            onClick={() => navigate('/login')}
            className="group bg-[#FC8019] text-white w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Log In
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            className="bg-white/10 text-white w-full py-4 rounded-2xl font-extrabold text-lg hover:bg-white/20 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
          >
            Create an Account
          </button>
        </div>

      </div>
    </div>
  );
}
