import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { Video, Utensils, IndianRupee, FileText, Upload, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AddFood() {
  const [food, setFood] = useState({
    name: "",
    videoUrl: "",
    price: "",
    restaurant: "",
    description: "",
    category: "Burger"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/foods", food);
      alert("Reel and Food added successfully! 🎉");
      navigate("/reels");
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding food");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
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

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-md md:max-w-2xl mx-auto min-h-screen px-4 py-8 pb-32 pt-20 bg-[var(--bg-primary)] transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 flex items-center justify-between"
      >
         <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-1">Add New Reel</h1>
            <p className="text-[var(--brand-orange)] text-xs font-black uppercase tracking-[0.2em]">Partner Dashboard</p>
         </div>
         <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="p-3 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] text-[var(--text-primary)] transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
         </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-surface)] p-8 rounded-[3rem] shadow-2xl shadow-black/[0.03] border border-[var(--border-color)]"
      >
        <motion.form 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            onSubmit={submit} 
            className="space-y-6"
        >
          
          <motion.div variants={itemFadeUp}>
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-3 block ml-1">Video URL (Direct MP4 Link)</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--bg-primary)] rounded-xl flex items-center justify-center group-focus-within:bg-[var(--brand-orange)]/10 transition-colors">
                 <Video className="w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)] transition-colors" />
              </div>
              <input 
                name="videoUrl" 
                placeholder="https://content.reelbite.com/videos/pizzahut_special.mp4" 
                className="w-full bg-[var(--bg-primary)] border-2 border-transparent rounded-[1.5rem] py-4 pl-16 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)]/30 focus:outline-none transition-all placeholder-[var(--text-secondary)]/40" 
                onChange={handleChange} 
                required 
              />
            </div>
          </motion.div>

          <motion.div variants={itemFadeUp} className="space-y-4">
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1 block ml-1">Food Information</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--bg-primary)] rounded-xl flex items-center justify-center group-focus-within:bg-[var(--brand-orange)]/10 transition-colors">
                <Utensils className="w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)]" />
              </div>
              <input 
                name="name" 
                placeholder="Item Name (e.g. Truffle Mushroom Pizza)" 
                className="w-full bg-[var(--bg-primary)] border-2 border-transparent rounded-[1.5rem] py-4 pl-16 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)]/30 focus:outline-none transition-all placeholder-[var(--text-secondary)]/40" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative group flex-grow">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--bg-primary)] rounded-xl flex items-center justify-center group-focus-within:bg-[var(--brand-orange)]/10 transition-colors">
                   <IndianRupee className="w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)]" />
                </div>
                <input 
                  name="price" 
                  type="number"
                  placeholder="Price" 
                  className="w-full bg-[var(--bg-primary)] border-2 border-transparent rounded-[1.5rem] py-4 pl-16 pr-4 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)]/30 focus:outline-none transition-all placeholder-[var(--text-secondary)]/40" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <select name="category" onChange={handleChange} className="w-1/2 p-4 px-6 rounded-[1.5rem] bg-[var(--bg-primary)] border-2 border-transparent text-[var(--text-primary)] font-black focus:outline-none focus:border-[var(--brand-orange)]/30 appearance-none cursor-pointer transition-all">
                <option value="Burger">🍔 Burger</option>
                <option value="Pizza">🍕 Pizza</option>
                <option value="Healthy">🥗 Healthy</option>
                <option value="Dessert">🍰 Dessert</option>
                <option value="Drinks">🍹 Drinks</option>
                <option value="Other">🍽️ Other</option>
              </select>
            </div>
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-3 block ml-1">Restaurant Name</label>
            <input 
              name="restaurant" 
              placeholder="e.g. La Pino'z Pizza" 
              className="w-full bg-[var(--bg-primary)] border-2 border-transparent rounded-[1.5rem] py-4 px-6 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)]/30 focus:outline-none transition-all placeholder-[var(--text-secondary)]/40" 
              onChange={handleChange} 
              required 
            />
          </motion.div>

          <motion.div variants={itemFadeUp}>
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-3 block ml-1">Description</label>
            <div className="relative group">
              <div className="absolute left-4 top-6 w-10 h-10 bg-[var(--bg-primary)] rounded-xl flex items-center justify-center group-focus-within:bg-[var(--brand-orange)]/10 transition-colors">
                 <FileText className="w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--brand-orange)]" />
              </div>
              <textarea 
                name="description" 
                placeholder="Tell users why they'll love this..." 
                className="w-full bg-[var(--bg-primary)] border-2 border-transparent rounded-[1.5rem] py-4 pl-16 pr-6 text-[var(--text-primary)] font-bold focus:border-[var(--brand-orange)]/30 focus:outline-none transition-all placeholder-[var(--text-secondary)]/40 resize-none h-32" 
                onChange={handleChange} 
              />
            </div>
          </motion.div>

          <motion.button 
            variants={itemFadeUp}
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[var(--brand-orange)] text-white h-16 rounded-[1.5rem] font-black flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-orange-500/30 transition-all disabled:opacity-50 mt-4 text-lg tracking-tight"
          >
            <Upload className="w-6 h-6" strokeWidth={3} />
            <span>{loading ? "UPLOADING..." : "PUBLISH REEL"}</span>
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}