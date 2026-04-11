import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--bg-primary)] flex flex-col justify-between p-6 relative z-10 pt-20 overflow-hidden text-[var(--text-primary)] transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--brand-orange)]/10 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--brand-yellow)]/10 blur-[120px] rounded-full z-0" />

      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row justify-center items-center text-center md:text-left max-w-sm md:max-w-6xl mx-auto md:w-full md:gap-16 lg:gap-32 relative z-10">
        
        {/* Main Graphic/Icon */}
        <div className="relative group mb-12 md:mb-0 md:order-2">
            <div className="w-48 h-48 md:w-80 md:h-80 bg-gradient-to-tr from-[var(--brand-orange)] to-[var(--brand-yellow)] rounded-[3rem] md:rounded-[5rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 rotate-[-8deg] group-hover:rotate-0 transition-all duration-700">
                <span className="text-7xl md:text-9xl filter drop-shadow-xl animate-bounce">🍕</span>
            </div>
            {/* Absolute badges floating */}
            <div className="absolute -top-4 -right-4 bg-[var(--bg-surface)] px-4 py-2 rounded-2xl shadow-xl font-black text-[var(--text-primary)] text-sm animate-pulse border border-[var(--border-color)]">Hot & Fresh</div>
            <div className="absolute -bottom-4 -left-4 bg-[var(--bg-surface)] px-4 py-2 rounded-2xl shadow-xl font-black text-[var(--brand-orange)] text-sm border border-[var(--border-color)]">4.8 ★ Ratings</div>
        </div>
        
        <div className="md:order-1 flex flex-col items-center md:items-start md:max-w-lg">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
              Taste the <span className="text-[var(--brand-orange)]">Future</span> of Food.
            </h1>
            <p className="text-[var(--text-secondary)] font-bold mb-12 md:text-xl leading-relaxed">
              Watch delicious reels, explore curated top brands, and get lightning-fast delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row w-full gap-5 mt-2">
              <button 
                onClick={() => navigate('/login')}
                className="group bg-[var(--text-primary)] text-[var(--bg-primary)] w-full py-5 px-10 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:scale-[1.03] active:scale-95 transition-all"
              >
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/register')}
                className="bg-[var(--bg-surface)] text-[var(--text-primary)] border-2 border-[var(--border-color)] w-full py-5 px-10 rounded-[2rem] font-black text-lg hover:border-[var(--brand-orange)]/50 transition-all shadow-xl shadow-black/[0.02] hover:scale-[1.03] active:scale-95"
              >
                Join Now
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
