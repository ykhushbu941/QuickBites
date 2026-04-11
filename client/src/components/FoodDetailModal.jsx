import { useContext, useEffect, useState } from "react";
import { X, Star, Clock, MapPin, Plus, Minus, Video } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function FoodDetailModal({ food, onClose }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Find item in cart to get accurate quantity
  useEffect(() => {
    const item = cart.find(c => c.food._id === food?._id);
    setQuantity(item ? item.quantity : 0);
  }, [cart, food]);

  // Handle slide-up animation
  useEffect(() => {
    if (food) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [food]);

  if (!food) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // wait for animation
  };

  const handleAdd = () => {
    addToCart(food);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      removeFromCart(food._id);
    }
  };

  const viewReel = () => {
    handleClose();
    // In a real app we'd scroll to this specific reel, but for now navigate to reels page
    navigate('/reels');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${isVisible ? 'translate-y-0' : 'translate-y-full sm:translate-y-12 sm:opacity-0 sm:scale-95'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-[60] p-2.5 bg-white/90 backdrop-blur-md rounded-full text-[#1C1C1C] shadow-xl border border-black/5 hover:scale-110 active:scale-95 transition-all"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>

        {/* Hero Image */}
        <div className="h-72 sm:h-80 w-full relative group">
          <img 
            src={food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
            alt={food.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Details Section */}
        <div className="px-8 relative -top-12 bg-white rounded-t-[3rem] pt-4 pb-8 flex flex-col h-[calc(100vh-16rem)] sm:h-auto sm:max-h-[70vh]">
          
          {/* Drag Handle (Mobile) */}
          <div className="w-16 h-1.5 bg-black/5 rounded-full mx-auto mb-8 shrink-0 sm:hidden" />
          
          <div className="overflow-y-auto no-scrollbar flex-grow pb-32">
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center bg-white shadow-sm ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                  </div>
                  {food.outOfStock && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">SOLD OUT</span>}
                  <span className="text-[11px] font-black text-[#FC8019] uppercase tracking-widest bg-[#FC8019]/10 px-2 py-1 rounded-lg">Best Seller</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1C] leading-[0.9] tracking-tighter mb-2">{food.name}</h2>
                <div className="flex items-center text-gray-400 font-bold text-sm">
                   <MapPin className="w-4 h-4 mr-1.5 text-[#FC8019]" /> {food.restaurant}
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-3xl font-black text-[#1C1C1C] tracking-tighter">₹{food.price}</p>
                <div className="flex items-center justify-end text-[#1C1C1C] text-sm mt-2 font-black bg-[#F8F9FA] px-3 py-1.5 rounded-xl border border-black/5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1.5" />
                    4.5 <span className="text-gray-400 ml-1 font-bold">(120+)</span>
                </div>
              </div>
            </div>

            {/* Tags area */}
            <div className="flex flex-wrap gap-2 my-4">
               {food.cuisine && food.cuisine !== "Other" && (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-medium text-white/80">
                     {food.cuisine}
                  </span>
               )}
               <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-medium flex items-center text-white/80">
                  <Clock className="w-3 h-3 mr-1" /> 25-30 min
               </span>
            </div>

            <hr className="border-white/5 my-4" />

            {/* Description */}
            <div>
              <h3 className="text-[13px] font-semibold text-white/90 mb-2 uppercase tracking-wide">About this dish</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {food.description || "A delicious meal prepared with the finest ingredients. Enjoy hot and fresh."}
              </p>
            </div>
            
            {/* Watch Reel Banner */}
            <div 
               onClick={viewReel}
               className="bg-gradient-to-br from-[#FC8019]/5 to-white border border-[#FC8019]/20 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:shadow-xl hover:shadow-orange-500/5 transition-all active:scale-95"
            >
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FC8019] to-[#FFB01F] flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                     <Video className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#1C1C1C]">Watch the Reel</h4>
                    <p className="text-sm text-gray-500 font-bold">See how it's made</p>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FC8019]/10 text-[#FC8019]">
                  <ArrowRight className="w-6 h-6 text-[#FC8019]" strokeWidth={3} />
               </div>
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t border-black/[0.03] flex items-center space-x-4 safe-area-bottom">
            <div className="flex-1">
              {quantity === 0 ? (
                <button 
                  onClick={handleAdd}
                  disabled={food.outOfStock}
                  className="w-full h-16 bg-[#1C1C1C] text-white font-black rounded-2xl shadow-2xl active:scale-95 transition-all text-lg hover:bg-black uppercase tracking-tight"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="w-full h-16 bg-white border-4 border-[#1C1C1C] rounded-2xl flex items-center justify-between px-4 group">
                  <button onClick={handleRemove} className="w-10 h-10 flex items-center justify-center text-[#1C1C1C] hover:bg-black/5 rounded-xl transition-colors">
                    <Minus className="w-6 h-6" strokeWidth={3} />
                  </button>
                  <span className="font-black text-[#1C1C1C] text-xl min-w-[20px] text-center">{quantity}</span>
                  <button onClick={handleAdd} className="w-10 h-10 flex items-center justify-center text-[#FC8019] hover:bg-[#FC8019]/10 rounded-xl transition-colors">
                    <Plus className="w-6 h-6" strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
            
            {quantity > 0 && (
              <div className="flex-1">
                <button 
                   className="w-full h-16 bg-[#FC8019] text-white font-black rounded-2xl shadow-2xl shadow-orange-500/20 active:scale-95 transition-all text-lg flex items-center justify-center space-x-2"
                   onClick={() => { handleClose(); navigate('/cart'); }}
                >
                    <span>View Cart</span>
                    <span className="opacity-60 font-medium">₹{food.price * quantity}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
