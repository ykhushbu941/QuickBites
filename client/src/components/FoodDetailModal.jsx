import { useContext, useEffect, useState } from "react";
import { X, Star, Clock, MapPin, Plus, Minus, Video, ArrowRight } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`w-full max-w-lg bg-[var(--bg-surface)] rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${isVisible ? 'translate-y-0' : 'translate-y-full sm:translate-y-12 sm:opacity-0 sm:scale-95'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-[60] p-2.5 bg-[var(--glass-bg)] backdrop-blur-md rounded-full text-[var(--text-primary)] shadow-xl border border-[var(--border-color)] hover:scale-110 active:scale-95 transition-all"
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
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--bg-surface)] to-transparent" />
        </div>

        {/* Details Section */}
        <div className="px-8 relative -top-12 bg-[var(--bg-surface)] rounded-t-[3rem] pt-4 pb-8 flex flex-col h-[calc(100vh-16rem)] sm:h-auto sm:max-h-[70vh] transition-colors">
          
          {/* Drag Handle (Mobile) */}
          <div className="w-16 h-1.5 bg-[var(--text-primary)]/5 rounded-full mx-auto mb-8 shrink-0 sm:hidden" />
          
          <div className="overflow-y-auto no-scrollbar flex-grow pb-32">
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center bg-[var(--bg-primary)] shadow-sm ${food.isVeg ? "border-[#3D9970]" : "border-[#E23744]"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
                  </div>
                  {food.outOfStock && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">SOLD OUT</span>}
                  <span className="text-[11px] font-black text-[var(--brand-orange)] uppercase tracking-widest bg-[var(--brand-orange)]/10 px-2 py-1 rounded-lg">Best Seller</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] leading-[0.9] tracking-tighter mb-2">{food.name}</h2>
                <div className="flex items-center text-[var(--text-secondary)] font-bold text-sm">
                   <MapPin className="w-4 h-4 mr-1.5 text-[var(--brand-orange)]" /> {food.restaurant}
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">₹{food.price}</p>
                <div className="flex items-center justify-end text-[var(--text-primary)] text-sm mt-2 font-black bg-[var(--bg-primary)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1.5" />
                    4.5 <span className="text-[var(--text-secondary)] ml-1 font-bold">(120+)</span>
                </div>
              </div>
            </div>

            {/* Tags area */}
            <div className="flex flex-wrap gap-2 my-4">
               {food.cuisine && food.cuisine !== "Other" && (
                  <span className="px-2.5 py-1 bg-[var(--text-primary)]/5 border border-[var(--border-color)] rounded-md text-[11px] font-medium text-[var(--text-secondary)]">
                     {food.cuisine}
                  </span>
               )}
               <span className="px-2.5 py-1 bg-[var(--text-primary)]/5 border border-[var(--border-color)] rounded-md text-[11px] font-medium flex items-center text-[var(--text-secondary)]">
                  <Clock className="w-3 h-3 mr-1" /> 25-30 min
               </span>
            </div>

            <hr className="border-[var(--border-color)] my-4" />

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-[13px] font-black text-[var(--text-secondary)] mb-2 uppercase tracking-widest">About this dish</h3>
              <p className="text-sm text-[var(--text-primary)]/70 leading-relaxed font-medium">
                {food.description || "A delicious meal prepared with the finest ingredients. Enjoy hot and fresh."}
              </p>
            </div>
            
            {/* Watch Reel Banner */}
            <div 
               onClick={viewReel}
               className="bg-gradient-to-br from-[var(--brand-orange)]/10 to-[var(--bg-primary)] border border-[var(--brand-orange)]/20 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:shadow-xl hover:shadow-orange-500/5 transition-all active:scale-95"
            >
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-yellow)] flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                     <Video className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[var(--text-primary)]">Watch the Reel</h4>
                    <p className="text-sm text-[var(--text-secondary)] font-bold">See how it's made</p>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]">
                  <ArrowRight className="w-6 h-6 text-[var(--brand-orange)]" strokeWidth={3} />
               </div>
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-[var(--bg-surface)] backdrop-blur-md border-t border-[var(--border-color)] flex items-center space-x-4 safe-area-bottom">
            <div className="flex-1">
              {quantity === 0 ? (
                <button 
                  onClick={handleAdd}
                  disabled={food.outOfStock}
                  className="w-full h-16 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black rounded-2xl shadow-2xl active:scale-95 transition-all text-lg uppercase tracking-tight"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="w-full h-16 bg-[var(--bg-surface)] border-4 border-[var(--text-primary)] rounded-2xl flex items-center justify-between px-4 group">
                  <button onClick={handleRemove} className="w-10 h-10 flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 rounded-xl transition-colors">
                    <Minus className="w-6 h-6" strokeWidth={3} />
                  </button>
                  <span className="font-black text-[var(--text-primary)] text-xl min-w-[20px] text-center">{quantity}</span>
                  <button onClick={handleAdd} className="w-10 h-10 flex items-center justify-center text-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/10 rounded-xl transition-colors">
                    <Plus className="w-6 h-6" strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
            
            {quantity > 0 && (
              <div className="flex-1">
                <button 
                   className="w-full h-16 bg-[var(--brand-orange)] text-white font-black rounded-2xl shadow-2xl shadow-orange-500/20 active:scale-95 transition-all text-lg flex items-center justify-center space-x-2"
                   onClick={() => { handleClose(); navigate('/cart'); }}
                >
                    <span>View Cart</span>
                    <span className="opacity-60 font-medium text-xs tracking-widest">₹{food.price * quantity}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
