import { useNavigate } from "react-router-dom";
import { ArrowRight, Utensils } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8F9FA] flex flex-col justify-between p-6 relative z-10 pt-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-400/10 blur-[120px] rounded-full z-0" />

      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row justify-center items-center text-center md:text-left max-w-sm md:max-w-6xl mx-auto md:w-full md:gap-16 lg:gap-32 relative z-10">
        
        {/* Main Graphic/Icon */}
        <div className="relative group mb-12 md:mb-0 md:order-2">
            <div className="w-48 h-48 md:w-80 md:h-80 bg-gradient-to-tr from-[#FC8019] to-[#FFB01F] rounded-[3rem] md:rounded-[5rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 rotate-[-8deg] group-hover:rotate-0 transition-all duration-700">
                <span className="text-7xl md:text-9xl filter drop-shadow-xl animate-bounce">🍕</span>
            </div>
            {/* Absolute badges floating */}
            <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-2xl shadow-xl font-black text-[#1C1C1C] text-sm animate-pulse">Hot & Fresh</div>
            <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-2xl shadow-xl font-black text-[#FC8019] text-sm">4.8 ★ Ratings</div>
        </div>
        
        <div className="md:order-1 flex flex-col items-center md:items-start md:max-w-lg">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-[#1C1C1C] leading-[0.9] tracking-tighter mb-6">
              Taste the <span className="text-[#FC8019]">Future</span> of Food.
            </h1>
            <p className="text-gray-500 font-bold mb-12 md:text-xl leading-relaxed">
              Watch delicious reels, explore curated top brands, and get lightning-fast delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row w-full gap-5 mt-2">
              <button 
                onClick={() => navigate('/login')}
                className="group bg-[#1C1C1C] text-white w-full py-5 px-10 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:scale-[1.03] active:scale-95 transition-all"
              >
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-[#1C1C1C] border-2 border-black/[0.03] w-full py-5 px-10 rounded-[2rem] font-black text-lg hover:border-[#FC8019]/50 transition-all shadow-xl shadow-black/[0.02] hover:scale-[1.03] active:scale-95"
              >
                Join Now
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
