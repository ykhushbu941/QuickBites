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
    <div className="mt-4 mb-4">
      <div className="flex justify-between items-end mb-6 px-1">
        <h2 className="font-black text-xl md:text-2xl text-[var(--text-primary)] tracking-tight flex items-center">
           Top brands for you <div className="ml-4 h-1 w-1 rounded-full bg-[var(--brand-orange)]" />
        </h2>
        <button className="text-[var(--brand-orange)] text-[13px] font-black hover:underline px-2 uppercase tracking-widest">View All</button>
      </div>

      <div className="flex overflow-x-auto space-x-6 md:space-x-8 no-scrollbar pb-8 -mx-4 md:mx-0 px-4 md:px-0 snap-x snap-mandatory">
        {restaurants.map((rest, i) => (
          <div 
             key={i} 
             onClick={() => onRestaurantClick && onRestaurantClick(rest.name)}
             className="min-w-[260px] max-w-[260px] md:min-w-[320px] md:max-w-[320px] snap-start bg-[var(--bg-surface)] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/[0.03] border border-[var(--border-color)] flex flex-col shrink-0 cursor-pointer hover:-translate-y-2 transition-all duration-500 ease-out group"
          >
            {/* Image Banner */}
            <div className="h-36 md:h-40 w-full relative overflow-hidden">
               <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-[#1C1C1C] flex items-center shadow-lg border border-black/5 uppercase tracking-widest">
                  CURATED
               </div>
               
               <div className="absolute bottom-4 left-4 flex items-center bg-[#3D9970] text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-lg">
                  {rest.rating} <Star className="w-3 h-3 ml-1 fill-white" />
               </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-grow bg-[var(--bg-surface)]">
               <div className="mb-1">
                  <h3 className="font-black text-[var(--text-primary)] truncate text-lg md:text-xl tracking-tight group-hover:text-[var(--brand-orange)] transition-colors">{rest.name}</h3>
               </div>
               
               <p className="text-[13px] text-[var(--text-secondary)] font-bold truncate mb-6">
                   {rest.cuisines.length > 0 ? rest.cuisines.join(", ") : "Multi-cuisine"}
               </p>

               <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-5">
                  <div className="flex items-center text-[var(--text-primary)] text-[13px] font-black tracking-tight">
                      <Clock className="w-4 h-4 mr-2 text-[var(--brand-orange)]" /> {rest.time}
                  </div>
                  <div className="text-[10px] font-black text-[var(--brand-orange)] px-2.5 py-1.5 bg-[var(--brand-orange)]/10 rounded-xl uppercase tracking-tighter">
                      Free Delivery
                  </div>
               </div>
            </div>
          </div>
        ))}
        {/* Extra spacer for end padding */}
        <div className="min-w-[40px] shrink-0 md:hidden" />
      </div>
    </div>
  );
}
