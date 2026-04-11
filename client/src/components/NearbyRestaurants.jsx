import { Star, Clock } from "lucide-react";

export default function NearbyRestaurants({ foods, onRestaurantClick }) {
  // Extract unique restaurants from foods
  if (!foods || foods.length === 0) return null;

  // Group foods by restaurant to get images/cuisines
  const restaurantMap = new Map();
  
  foods.forEach(food => {
      if (!restaurantMap.has(food.restaurant)) {
          // generate random metrics for mock purposes based on string hash to remain consistent
          const hash = food.restaurant.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
          const time = 20 + (Math.abs(hash) % 25); // 20-45 mins
          const rating = 3.8 + ((Math.abs(hash) % 12) / 10); // 3.8 - 4.9
          
          restaurantMap.set(food.restaurant, {
              name: food.restaurant,
              image: food.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
              rating: rating.toFixed(1),
              time: `${time}-${time + 10} mins`,
              cuisines: [food.cuisine].filter(c => c && c !== "Other")
          });
      } else {
          // Add cuisine if unique
          const entry = restaurantMap.get(food.restaurant);
          if (food.cuisine && food.cuisine !== 'Other' && !entry.cuisines.includes(food.cuisine)) {
              if (entry.cuisines.length < 2) entry.cuisines.push(food.cuisine);
          }
      }
  });

  const restaurants = Array.from(restaurantMap.values());

  if (restaurants.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <div className="flex justify-between items-end mb-5">
        <h2 className="font-black text-xl md:text-2xl text-[#1C1C1C] tracking-tight">Top brands for you</h2>
        <button className="text-[#FC8019] text-sm font-black hover:underline px-2">View All</button>
      </div>

      <div className="flex overflow-x-auto space-x-6 no-scrollbar pb-6 -mx-4 px-4 snap-x snap-mandatory">
        {restaurants.map((rest, i) => (
          <div 
             key={i} 
             onClick={() => onRestaurantClick && onRestaurantClick(rest.name)}
             className="min-w-[280px] max-w-[280px] md:min-w-[340px] md:max-w-[340px] snap-center bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-black/5 border border-black/[0.03] flex flex-col shrink-0 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          >
            {/* Image Banner */}
            <div className="h-40 md:h-44 w-full relative">
               <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
               <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-[#1C1C1C] flex items-center shadow-lg border border-black/5 uppercase tracking-widest">
                  CURATED
               </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-grow bg-white">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-[#1C1C1C] truncate max-w-[200px] text-lg md:text-xl tracking-tight">{rest.name}</h3>
                  <div className="flex items-center bg-[#3D9970] text-white px-2 py-1 rounded-lg text-xs font-black shadow-lg shadow-green-900/10">
                     {rest.rating} <Star className="w-3 h-3 ml-1 fill-white" />
                  </div>
               </div>
               
               <p className="text-sm text-gray-400 font-bold truncate mb-5">
                   {rest.cuisines.length > 0 ? rest.cuisines.join(", ") : "Multi-cuisine"}
               </p>

               <div className="flex items-center justify-between border-t border-black/[0.03] pt-4">
                  <div className="flex items-center text-[#1C1C1C] text-xs font-black tracking-tight">
                      <Clock className="w-4 h-4 mr-2 text-[#FC8019]" /> {rest.time}
                  </div>
                  <div className="text-[11px] font-black text-[#FC8019] px-2 py-1 bg-[#FC8019]/10 rounded-lg">
                      Free Delivery
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
