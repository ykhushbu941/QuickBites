import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Grid, Flame, Soup, Pizza, Search as SearchIcon, Star } from "lucide-react";
import NearbyRestaurants from "../components/NearbyRestaurants";
import FoodDetailModal from "../components/FoodDetailModal";

const CATEGORIES = ["All", "Pizza", "Burger", "Dessert", "Drinks", "Other"];
const CUISINES = ["All", "Indian", "South", "Chinese", "Italian", "Mexican", "American", "Japanese"];

const CUISINE_ICONS = {
  All: "🌎", Indian: "🇮🇳", "South": "🌴", Chinese: "🏮",
  Italian: "🍕", Mexican: "🌮", American: "🍔", Japanese: "🍣"
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

      const res = await axios.get(`http://localhost:5000/api/foods?${params.toString()}`);
      setFoods(res.data);
    } catch (err) {
      console.error("Failed to fetch foods", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if(e) e.preventDefault();
    fetchFoods(search);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 py-4 pt-16 bg-brand-dark">

      {/* Header Search Area (Swiggy style banner) */}
      <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] border-b border-white/5 -mx-4 -mt-4 px-4 pt-6 pb-12 rounded-b-[2rem] shadow-xl relative z-10">
          <form onSubmit={handleSearch} className="relative z-20">
            <input
              type="text"
              placeholder="Restaurant name or dish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white font-semibold focus:outline-none focus:border-[#FC8019]/50 shadow-md placeholder-gray-500 transition-colors"
            />
            <SearchIcon className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
          </form>
          
          <div className="flex justify-between items-center mt-6 text-white px-1">
              <div>
                  <h2 className="text-2xl font-extrabold flex items-center tracking-tight">
                     Find what you crave <span className="ml-2 text-xl opacity-80">🔥</span>
                  </h2>
                  <p className="text-sm text-white/50 font-medium mt-0.5">Explore top dishes near your location</p>
              </div>
          </div>
      </div>

      {/* Nearby Restaurants Section */}
      <div className="-mt-6 relative z-10">
         <NearbyRestaurants foods={foods} onRestaurantClick={(name) => { setSearch(name); fetchFoods(name); }} />
      </div>

      {/* Filters Section */}
      <div className="mt-8 space-y-5">
        
        {/* Quick Filters */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setVegFilter("all")}
            className={`flex items-center shrink-0 px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all ${vegFilter === "all" ? "bg-white/10 text-white" : "bg-transparent text-gray-400"}`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter("veg")}
            className={`flex items-center shrink-0 px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all ${vegFilter === "veg" ? "bg-[#3D9970]/20 text-[#3D9970] border-[#3D9970]/50" : "bg-transparent text-gray-400"}`}
          >
             <div className="w-3 h-3 rounded-sm border border-[#3D9970] flex items-center justify-center mr-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#3D9970]"></div></div>
             Veg
          </button>
          <button
            onClick={() => setVegFilter("nonveg")}
            className={`flex items-center shrink-0 px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all ${vegFilter === "nonveg" ? "bg-[#E23744]/20 text-[#E23744] border-[#E23744]/50" : "bg-transparent text-gray-400"}`}
          >
             <div className="w-3 h-3 rounded-sm border border-[#E23744] flex items-center justify-center mr-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#E23744]"></div></div>
             Non-Veg
          </button>
        </div>

        {/* Cuisine Bubbles */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">What's on your mind?</h3>
          <div className="flex overflow-x-auto space-x-4 no-scrollbar pb-2">
            {CUISINES.map(c => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className="flex flex-col items-center shrink-0 w-[72px] space-y-2 group"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform group-active:scale-95 ${
                  cuisine === c
                    ? "bg-[#FC8019] border-2 border-white scale-105 shadow-[#FC8019]/40"
                    : "bg-[#2A2A2A] border border-white/5"
                }`}>
                  {CUISINE_ICONS[c]}
                </div>
                <span className={`text-[11px] font-semibold tracking-tight ${cuisine === c ? "text-[#FC8019]" : "text-gray-400"}`}>
                  {c}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className="mt-8 pb-32">
        <h2 className="text-[17px] font-bold text-white mb-4">
           {loading ? "Discovering..." : `${foods.length} items to explore`}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#2A2A2A] h-64 rounded-2xl" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16 bg-[#2A2A2A] rounded-2xl mx-1 border border-white/5">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-white font-bold">No dishes found</p>
            <p className="text-gray-400 text-sm mt-1">Try another search or filter</p>
            <button onClick={() => {setSearch(""); setCategory("All"); setCuisine("All"); setVegFilter("all");}} className="mt-4 px-6 py-2 bg-white/10 rounded-full text-sm font-semibold text-brand-primary">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {foods.map(food => (
              <div
                key={food._id}
                className="card-surface overflow-hidden flex flex-col group cursor-pointer hover:border-brand-primary/40 transition-all"
                onClick={() => setSelectedFood(food)}
              >
                {/* Image */}
                <div className="h-36 bg-[#1C1C1C] relative overflow-hidden">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                  )}

                  {/* Veg/Non-veg Dot */}
                  <div className={`absolute top-2 right-2 w-4 h-4 rounded-sm border flex items-center justify-center shadow-lg bg-black/50 backdrop-blur-md ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                    <div className={`w-2 h-2 rounded-full z-10 ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                  </div>
                  
                  {/* Rating Bubble mock */}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center">
                     4.5 <Star className="w-2.5 h-2.5 ml-0.5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>

                <div className="p-3 flex flex-col flex-grow justify-between relative bg-gradient-to-b from-[#2C2C2C] to-[#252525]">
                  <div>
                    <h3 className="font-bold text-sm text-white mb-0.5 line-clamp-1">{food.name}</h3>
                    <p className="text-gray-400 text-[11px] truncate mb-3">{food.restaurant}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="text-white font-bold text-sm">₹{food.price}</div>
                  </div>
                  
                  {/* Floating Add Button overlapping image and content */}
                  <div className="absolute bottom-3 right-3">
                     <div className="bg-brand-primary/10 border border-brand-primary text-brand-primary px-4 py-1.5 rounded-lg text-xs font-bold uppercase shadow-sm">
                         ADD
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Render */}
      <FoodDetailModal 
         food={selectedFood} 
         onClose={() => setSelectedFood(null)} 
      />

    </div>
  );
}
