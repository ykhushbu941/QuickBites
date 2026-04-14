import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import { Bookmark, Plus, ArrowLeft, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SavedPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedFoods();
  }, []);

  const fetchSavedFoods = async () => {
    try {
      const res = await API.get("/auth/user/me");
      setFoods(res.data.savedFoods || []);
    } catch (err) {
      console.error("Failed to fetch saved foods", err);
    } finally {
      setLoading(false);
    }
  };

  const removeSaved = async (id, e) => {
    e.stopPropagation();
    try {
      await API.put(`/auth/user/save/${id}`);
      setFoods(foods.filter(f => f._id !== id));
    } catch (err) {
      console.error("Failed to remove saved food");
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardFadeUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="max-w-md md:max-w-7xl mx-auto min-h-screen px-4 py-8 pt-20 bg-[var(--bg-primary)] transition-colors duration-300">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="w-12 h-12 rounded-2xl bg-[var(--brand-orange)]/10 flex items-center justify-center"
          >
            <Bookmark className="w-6 h-6 text-[var(--brand-orange)]" fill="currentColor" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">Saved Reels</h1>
            <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">Your collection</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="p-3 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] text-[var(--text-primary)] hover:scale-110 active:scale-95 transition-all shadow-sm">
            <ArrowLeft className="w-6 h-6" />
        </button>
      </motion.div>

      <div className="pb-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[var(--bg-surface)] h-64 rounded-[2rem] border border-[var(--border-color)]"></div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20 flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-6 shadow-inner">
               <Bookmark className="w-10 h-10 text-[var(--text-secondary)]/30" />
            </div>
            <p className="text-[var(--text-primary)] font-black text-xl tracking-tight">Your bookmarks are empty</p>
            <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-xs mx-auto">Explore reels and save your favorite dishes to find them later!</p>
            <Link to="/reels" className="mt-8 bg-[var(--brand-orange)] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Explore Reels</Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {foods.map(food => (
              <motion.div 
                key={food._id} 
                variants={cardFadeUp}
                onClick={() => navigate(`/home?search=${encodeURIComponent(food.name)}`)}
                className="bg-[var(--bg-surface)] overflow-hidden rounded-[2rem] flex flex-col group cursor-pointer border border-[var(--border-color)] hover:border-[var(--brand-orange)]/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500"
              >
                <div className="h-48 relative flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                   {(food.videoUrl && !food.videoUrl.includes("dummy")) ? (
                     <video src={food.videoUrl} className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-1000" muted />
                   ) : (
                     <div className="w-full h-full bg-[var(--bg-primary)] flex items-center justify-center text-5xl">🍔</div>
                   )}
                   
                   <div className="absolute top-4 left-4 z-20">
                      <div className="bg-[var(--glass-bg)] backdrop-blur-md p-2 rounded-xl border border-[var(--border-color)] shadow-sm">
                         <Video className="w-4 h-4 text-[var(--brand-orange)]" />
                      </div>
                   </div>

                   <button 
                     onClick={(e) => removeSaved(food._id, e)}
                     className="absolute top-4 right-4 z-20 bg-[var(--bg-surface)] backdrop-blur-md p-2.5 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-[var(--border-color)]"
                   >
                      <Bookmark className="w-5 h-5 text-[var(--brand-orange)]" fill="currentColor" />
                   </button>
                </div>
                
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-black text-[var(--text-primary)] text-base truncate tracking-tight">{food.name}</h3>
                    <p className="text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-wider truncate mt-0.5">{food.restaurant}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border-color)]">
                    <span className="font-black text-[var(--text-primary)] text-lg tracking-tighter">₹{food.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(food); }}
                      className="bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] p-2.5 rounded-xl hover:bg-[var(--brand-orange)] hover:text-white transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
