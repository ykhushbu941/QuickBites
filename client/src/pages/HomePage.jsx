import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Grid, Flame, Soup, Pizza, Search as SearchIcon, Star, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NearbyRestaurants from "../components/NearbyRestaurants";
import FoodDetailModal from "../components/FoodDetailModal";
import { CartContext } from "../context/CartContext";

const CATEGORIES = ["All", "Pizza", "Burger", "Dessert", "Drinks", "Snacks", "Healthy", "Other"];
const CUISINES = ["All", "Indian", "South Indian", "Chinese", "Italian", "Mexican", "American", "Japanese", "Healthy", "Mediterranean"];

const CUISINE_ICONS = {
  All: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop", 
  "Indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=200&auto=format&fit=crop", 
  "South Indian": "https://images.unsplash.com/photo-1589301760014-d929f3979bdb?q=80&w=200&auto=format&fit=crop", 
  "Chinese": "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=200&auto=format&fit=crop",
  "Italian": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=200&auto=format&fit=crop", 
  "Mexican": "https://images.unsplash.com/photo-1565299585323-38d6b0865597?q=80&w=200&auto=format&fit=crop", 
  "American": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop", 
  "Japanese": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop",
  "Healthy": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop", 
  "Mediterranean": "https://images.unsplash.com/photo-1544124499-58962f3bd3a7?q=80&w=200&auto=format&fit=crop"
};

export default function HomePage() {
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get("search") || "";

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [cuisine, setCuisine] = useState("All");
  const [vegFilter, setVegFilter] = useState("all"); 
  const [search, setSearch] = useState(searchParam);
  
  // Contexts
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  
  // Modal State
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetchFoods(search);
  }, [category, cuisine, vegFilter]);

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
      fetchFoods(searchParam);
    }
  }, [searchParam]);

  const fetchFoods = async (keyword = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (category !== "All") params.set("category", category);
      
      // Handle "South" which refers to "South Indian" in DB
      let displayCuisine = cuisine;
      if (cuisine === "South") displayCuisine = "South Indian";
      
      if (displayCuisine !== "All") params.set("cuisine", displayCuisine);
      if (vegFilter === "veg") params.set("isVeg", "true");
      if (vegFilter === "nonveg") params.set("isVeg", "false");
      params.set("limit", "40");

      const res = await API.get(`/foods?${params.toString()}`);
      setFoods(res.data);
    } catch (err) {
      console.error("Failed to fetch foods", err);
    } finally {
      setLoading(false);
    }
  };

  const resetAllFilters = () => {
    setSearch("");
    setCategory("All");
    setCuisine("All");
    setVegFilter("all");
    fetchFoods("");
  };

  const handleSearch = (e) => {
    if(e) e.preventDefault();
    fetchFoods(search);
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

  const listItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-md md:max-w-7xl mx-auto min-h-screen px-4 md:px-8 py-4 pt-16 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[110] bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl border border-[var(--border-color)]"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--brand-orange)] flex items-center justify-center">
               <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Search Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden -mx-4 md:mx-auto -mt-4 md:mt-2 px-6 md:px-12 pt-10 pb-16 rounded-b-[3rem] md:rounded-[3rem] shadow-sm mb-8"
      >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-orange)] via-[var(--brand-yellow)] to-[var(--bg-primary)] opacity-90 z-0" />
          <motion.div 
            animate={{ 
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent z-0" 
          />
          
          <div className="relative z-10 md:max-w-2xl mx-auto">
              <div className="text-center mb-8">
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter mb-2 leading-tight"
                  >
                     Discover food <span className="text-[var(--brand-orange)] drop-shadow-sm">through reels</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[var(--text-primary)]/70 font-bold text-sm md:text-lg"
                  >
                    Quickly find your next meal in a scroll
                  </motion.p>
              </div>

              <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSearch} 
                className="relative group mb-8"
              >
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines or dishes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border-2 border-transparent rounded-[2rem] py-4 pl-14 pr-6 text-[var(--text-primary)] font-bold text-base shadow-2xl shadow-orange-900/10 focus:outline-none focus:border-[var(--brand-orange)] placeholder-[var(--text-secondary)]/50 transition-all group-hover:shadow-orange-900/20"
                />
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--brand-orange)] w-6 h-6" strokeWidth={2.5} />
              </motion.form>

              {/* Reels Highlight Quick Link */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <button 
                  onClick={() => navigate('/reels')}
                  className="flex items-center space-x-3 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-2xl hover:bg-white/30 transition-all group shadow-xl"
                >
                   <div className="w-10 h-10 bg-[var(--brand-orange)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Flame className="w-6 h-6 text-white" fill="currentColor" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]/60">Playable Reels</p>
                      <p className="text-sm font-black text-[var(--text-primary)]">Watch Trending Food</p>
                   </div>
                </button>
              </motion.div>
          </div>
      </motion.div>

      {/* ── Section 1: What's on your mind? (Cuisines) ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.1 }}
        className="mt-8 mb-12"
      >
        <div className="flex items-center justify-between mb-8 px-1">
          <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center">
             What's on your mind? <div className="ml-4 h-[2px] w-12 bg-[var(--brand-orange)]/30 rounded-full" />
          </h3>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="flex overflow-x-auto space-x-6 md:space-x-12 no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {CUISINES.map(c => (
            <motion.button
              key={c}
              variants={listItem}
              onClick={() => setCuisine(c)}
              className="flex flex-col items-center shrink-0 group transition-all duration-300"
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden mb-3 transition-all duration-300 ease-out group-active:scale-95 ${
                cuisine === c
                  ? "border-4 border-[var(--brand-orange)] shadow-md shadow-orange-400/25 scale-110"
                  : "border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300"
              }`}>
                <img src={CUISINE_ICONS[c]} alt={c} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 ${cuisine === c ? "" : "opacity-90 group-hover:opacity-100"}`} />
              </div>
              <span className={`text-[13px] md:text-[15px] tracking-tight transition-colors mt-1 ${
                cuisine === c 
                  ? "text-[var(--brand-orange)] font-black" 
                  : "text-[var(--text-secondary)] font-semibold group-hover:text-[var(--text-primary)]"
              }`}>
                {c}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Section 2: Top Brands ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        className="relative z-20 md:max-w-7xl md:mx-auto"
      >
         <NearbyRestaurants foods={foods} onRestaurantClick={(name) => { setSearch(name); fetchFoods(name); }} />
      </motion.div>

      {/* ── Section 3: Main Feed & Filters ── */}
      <div className="mt-16 space-y-8">
        
        {/* Quick Filters Row */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2 px-1">
          <button
            onClick={() => setVegFilter("all")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-[13px] font-black border transition-all ${vegFilter === "all" ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] shadow-lg" : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]"}`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter("veg")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-[13px] font-black border transition-all ${vegFilter === "veg" ? "bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/30 shadow-sm" : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"}`}
          >
             <div className="w-3.5 h-3.5 rounded-sm border-2 border-[#3D9970] flex items-center justify-center mr-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3D9970]"></div></div>
             Veg
          </button>
          <button
            onClick={() => setVegFilter("nonveg")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-[13px] font-black border transition-all ${vegFilter === "nonveg" ? "bg-[#E23744]/10 text-[#E23744] border-[#E23744]/30 shadow-sm" : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"}`}
          >
             <div className="w-3.5 h-3.5 rounded-sm border-2 border-[#E23744] flex items-center justify-center mr-2"><div className="w-1.5 h-1.5 rounded-full bg-[#E23744]"></div></div>
             Non-Veg
          </button>
          
          <div className="flex-grow" />
          <button onClick={resetAllFilters} className="shrink-0 text-[11px] font-black uppercase tracking-widest text-[var(--brand-orange)] hover:underline px-4">Reset All</button>
        </div>

        {/* Food Feed */}
        <div className="pb-32">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                 {loading ? "Discovering..." : `${foods.length} items curated for you`}
              </h2>
              <div className="h-[2px] w-12 bg-[var(--brand-orange)] rounded-full" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-[var(--bg-surface)] h-72 rounded-[2rem] border border-[var(--border-color)] shadow-sm" />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-[var(--bg-surface)] rounded-[3rem] border border-[var(--border-color)] shadow-sm"
            >
              <p className="text-6xl mb-6">🍛</p>
              <p className="text-[var(--text-primary)] font-black text-xl">No dishes found</p>
              <p className="text-[var(--text-secondary)] text-sm mt-2 max-w-[250px] mx-auto">We couldn't find items matching your filters. Try exploring other cuisines!</p>
              <button onClick={resetAllFilters} className="mt-8 px-8 py-3 bg-[var(--brand-orange)] rounded-full text-sm font-black text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Reset Filters</button>
            </motion.div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
            >
              {foods.map(food => (
                <motion.div
                  key={food._id}
                  variants={listItem}
                  whileHover={{ y: -5 }}
                  className="card-surface overflow-hidden flex flex-col group cursor-pointer relative"
                  onClick={() => setSelectedFood(food)}
                >
                  {/* Image Overlay */}
                  <div className="h-60 sm:h-44 md:h-48 relative overflow-hidden">
                    {food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 items-center justify-center text-5xl" style={{display: food.imageUrl ? 'none' : 'flex'}}>🍽️</div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center bg-white shadow-sm ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                          <div className={`w-2 h-2 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                        </div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-xl border border-white/30 px-3 py-1.5 rounded-full text-[13px] font-black text-white flex items-center shadow-2xl">
                       4.5 <Star className="w-3.5 h-3.5 ml-1 fill-[var(--brand-orange)] text-[var(--brand-orange)]" />
                    </div>
                  </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-lg text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--brand-orange)] transition-colors tracking-tight">{food.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm font-bold truncate mb-6">{food.restaurant}</p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-[var(--text-primary)] font-black text-xl tracking-tight">₹{food.price}</div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(food);
                            setToast(`${food.name} added to cart!`);
                            setTimeout(() => setToast(null), 2000);
                        }}
                        className="bg-[var(--bg-surface)] border-2 border-[var(--brand-orange)] text-[var(--brand-orange)] px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-[var(--brand-orange)] hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center space-x-2"
                    >
                        <span>ADD</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-orange)] group-hover:bg-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>

      <FoodDetailModal 
         food={selectedFood} 
         onClose={() => setSelectedFood(null)} 
      />
    </div>
  );
}
