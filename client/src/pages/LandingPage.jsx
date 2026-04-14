import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--bg-primary)] flex flex-col justify-between p-6 relative z-10 pt-20 overflow-hidden text-[var(--text-primary)] transition-colors duration-300">
      {/* Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 20, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--brand-orange)] blur-[120px] rounded-full z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.12, 0.1],
          x: [0, -20, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--brand-yellow)] blur-[120px] rounded-full z-0" 
      />

      {/* Hero Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col md:flex-row justify-center items-center text-center md:text-left max-w-sm md:max-w-6xl mx-auto md:w-full md:gap-16 lg:gap-32 relative z-10"
      >
        
        {/* Main Graphic/Icon */}
        <motion.div 
          variants={itemVariants}
          className="relative group mb-12 md:mb-0 md:order-2"
        >
            <motion.div 
              animate={{ rotate: [-2, 0, -2], y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-[400px] md:w-80 md:h-[500px] bg-black rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-orange-500/20 overflow-hidden relative border-4 border-white/10"
            >
                {/* 🎥 Local hero reel — instant autoplay, zero branding */}
                <video
                  src="/videos/reel1.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Absolute badges floating */}
            <motion.div 
               animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="absolute top-10 -right-8 bg-[var(--bg-surface)] px-4 py-2 rounded-2xl shadow-xl font-black text-[var(--text-primary)] text-sm border border-[var(--border-color)] z-20"
            >
               Trending 🔥
            </motion.div>
            
            <motion.div 
               animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
               transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-10 -left-8 bg-[var(--bg-primary)] px-4 py-2 rounded-2xl shadow-xl font-black text-[var(--brand-orange)] text-sm border border-[var(--border-color)] z-20"
            >
               Watch & Order
            </motion.div>
        </motion.div>
        
        <div className="md:order-1 flex flex-col items-center md:items-start md:max-w-lg">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6"
            >
              Taste the <span className="text-[var(--brand-orange)]">Future</span> of Food.
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-[var(--text-secondary)] font-bold mb-12 md:text-xl leading-relaxed"
            >
              Watch delicious reels, explore curated top brands, and get lightning-fast delivery.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row w-full gap-5 mt-2"
            >
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
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
