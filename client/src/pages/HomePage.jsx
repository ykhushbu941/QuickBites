import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, MapPin, Grid, Flame, Soup, Pizza, Search as SearchIcon, Star, CheckCircle } from "lucide-react";
import NearbyRestaurants from "../components/NearbyRestaurants";
import FoodDetailModal from "../components/FoodDetailModal";
import { CartContext } from "../context/CartContext";

const CATEGORIES = ["All", "Pizza", "Burger", "Dessert", "Drinks", "Snacks", "Healthy", "Other"];
const CUISINES = ["All", "Indian", "South Indian", "Chinese", "Italian", "Mexican", "American", "Japanese", "Healthy", "Mediterranean"];

const CUISINE_ICONS = {
  All: "🌎", "Indian": "🇮🇳", "South Indian": "🍛", "Chinese": "🏮",
  "Italian": "🍕", "Mexican": "🌮", "American": "🍔", "Japanese": "🍣",
  "Healthy": "🥗", "Mediterranean": "🥙"
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

      const res = await axios.get(`/api/foods?${params.toString()}`);
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
    <div className="max-w-md md:max-w-7xl mx-auto min-h-screen px-4 md:px-8 py-4 pt-16 bg-[#F8F9FA]">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] bg-[#1C1C1C] text-white px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl animate-slide-up border border-white/10">
          <div className="w-5 h-5 rounded-full bg-[#FC8019] flex items-center justify-center">
             <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">{toast}</span>
        </div>
      )}

      {/* Header Search Area (Swiggy Premium style banner) */}
      <div className="relative overflow-hidden -mx-4 md:mx-auto -mt-4 md:mt-2 px-6 md:px-12 pt-10 pb-16 rounded-b-[3rem] md:rounded-[3rem] shadow-sm mb-8">
          {/* Animated Mesh Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FC8019] via-[#FFB01F] to-[#FFFFFF] opacity-90 z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent z-0" />
          
          <div className="relative z-10 md:max-w-2xl mx-auto">
              <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-5xl font-black text-[#1C1C1C] tracking-tighter mb-2 leading-tight">
                     Find what you <span className="text-white drop-shadow-md">crave</span>
                  </h2>
                  <p className="text-[#1C1C1C]/70 font-bold text-sm md:text-lg">Discover the best food & drinks in your city</p>
              </div>

              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines or dishes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border-2 border-transparent rounded-[2rem] py-4 pl-14 pr-6 text-[#1C1C1C] font-bold text-base shadow-2xl shadow-orange-900/10 focus:outline-none focus:border-[#FC8019] placeholder-gray-400 transition-all group-hover:shadow-orange-900/20"
                />
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FC8019] w-6 h-6" strokeWidth={2.5} />
              </form>
          </div>
      </div>

      {/* Nearby Restaurants Section */}
      <div className="-mt-12 relative z-20 md:max-w-5xl md:mx-auto px-2">
         <NearbyRestaurants foods={foods} onRestaurantClick={(name) => { setSearch(name); fetchFoods(name); }} />
      </div>

      {/* Filters Section */}
      <div className="mt-12 space-y-6 md:mt-16">
        
        {/* Quick Filters */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setVegFilter("all")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-sm font-black border transition-all ${vegFilter === "all" ? "bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-lg shadow-black/10" : "bg-white text-gray-500 border-black/5 hover:border-black/10"}`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter("veg")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-sm font-black border transition-all ${vegFilter === "veg" ? "bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/30 shadow-sm" : "bg-white text-gray-500 border-black/5"}`}
          >
             <div className="w-3.5 h-3.5 rounded-sm border-2 border-[#3D9970] flex items-center justify-center mr-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3D9970]"></div></div>
             Veg
          </button>
          <button
            onClick={() => setVegFilter("nonveg")}
            className={`flex items-center shrink-0 px-6 py-2.5 rounded-2xl text-sm font-black border transition-all ${vegFilter === "nonveg" ? "bg-[#E23744]/10 text-[#E23744] border-[#E23744]/30 shadow-sm" : "bg-white text-gray-500 border-black/5"}`}
          >
             <div className="w-3.5 h-3.5 rounded-sm border-2 border-[#E23744] flex items-center justify-center mr-2"><div className="w-1.5 h-1.5 rounded-full bg-[#E23744]"></div></div>
             Non-Veg
          </button>
        </div>

        {/* Cuisine Bubbles */}
        <div>
          <h3 className="text-xl font-black text-[#1C1C1C] tracking-tight mb-6 flex items-center">
             What's on your mind? <div className="ml-3 h-[2px] flex-grow bg-black/5 rounded-full" />
          </h3>
          <div className="flex overflow-x-auto space-x-6 md:space-x-10 no-scrollbar pb-4">
            {CUISINES.map(c => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className="flex flex-col items-center shrink-0 w-[84px] md:w-[100px] space-y-3 group"
              >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl transition-all duration-300 group-active:scale-90 ${
                  cuisine === c
                    ? "bg-[#FC8019]/10 ring-4 ring-[#FC8019] scale-105 shadow-xl shadow-orange-500/10"
                    : "bg-white border border-black/5 hover:shadow-md"
                }`}>
                  <span className={cuisine === c ? "drop-shadow-sm" : "grayscale-[0.2]"}>{CUISINE_ICONS[c]}</span>
                </div>
                <span className={`text-[13px] md:text-sm font-black tracking-tight transition-colors ${cuisine === c ? "text-[#FC8019]" : "text-gray-500 group-hover:text-[#1C1C1C]"}`}>
                  {c}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className="mt-12 pb-32">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black text-[#1C1C1C] tracking-tight">
               {loading ? "Discovering..." : `${foods.length} items curated for you`}
            </h2>
            <div className="h-[2px] w-12 bg-[#FC8019] rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-72 rounded-[2rem] border border-black/5 shadow-sm" />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-black/5 shadow-sm">
            <p className="text-6xl mb-6">🍛</p>
            <p className="text-[#1C1C1C] font-black text-xl">No dishes found</p>
            <p className="text-gray-400 text-sm mt-2 max-w-[250px] mx-auto">We couldn't find items matching your filters. Try exploring other cuisines!</p>
            <button onClick={() => {setSearch(""); setCategory("All"); setCuisine("All"); setVegFilter("all");}} className="mt-8 px-8 py-3 bg-[#FC8019] rounded-full text-sm font-black text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {foods.map(food => (
              <div
                key={food._id}
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
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F0F0F0] flex items-center justify-center text-4xl">🍽️</div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center bg-white shadow-sm ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                        <div className={`w-2 h-2 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                      </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[13px] font-black text-[#1C1C1C] flex items-center shadow-lg border border-black/5">
                     4.5 <Star className="w-3.5 h-3.5 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-lg text-[#1C1C1C] line-clamp-1 group-hover:text-[#FC8019] transition-colors">{food.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm font-bold truncate mb-6">{food.restaurant}</p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-[#1C1C1C] font-black text-xl tracking-tight">₹{food.price}</div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(food);
                            setToast(`${food.name} added to cart!`);
                            setTimeout(() => setToast(null), 2000);
                        }}
                        className="bg-white border-2 border-[#FC8019] text-[#FC8019] px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-[#FC8019] hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center space-x-2"
                    >
                        <span>ADD</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FC8019] group-hover:bg-white" />
                    </button>
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
