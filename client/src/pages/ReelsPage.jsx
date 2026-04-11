import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { Heart, MessageCircle, Send, Plus, Store, X, CheckCircle, Bookmark, Play } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// Single Reel Card
// ─────────────────────────────────────────────
const Reel = ({ food, isActive, isNext }) => {
  const videoRef = useRef(null);
  const { user, fetchUser } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
  const [likesCount, setLikesCount] = useState(food.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(food.comments || []);
  const [toast, setToast] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Auto-play / pause based on active state (passed from parent observer)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
        // Must use muted for autoplay policies across most browsers (we added it in markup),
        // catching the promise handles any blockages
        video.play().catch(e => console.log("Autoplay blocked/failed", e));
        setIsPaused(false);
    } else {
        video.pause();
        video.currentTime = 0; // reset
        setShowComments(false);
    }
  }, [isActive]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  let tapTimer = useRef(null);
  const handleSingleOrDoubleTap = (e) => {
    e.preventDefault();
    if (tapTimer.current) {
      // double tap
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      if (!isLiked) toggleLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 900);
    } else {
      tapTimer.current = setTimeout(() => {
        tapTimer.current = null;
        handleTap();
      }, 250);
    }
  };

  const toggleLike = async () => {
    try {
      await axios.post(`/api/foods/like/${food._id}`);
      setIsLiked(prev => !prev);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch {
      showToast("Error liking reel");
    }
  };

  const toggleSave = async (e) => {
    e.stopPropagation();
    try {
      await axios.post(`/api/auth/user/save/${food._id}`);
      setIsSaved(prev => !prev);
      showToast(isSaved ? "Removed from Saved" : "Reel Saved! 🔖");
      if (fetchUser) fetchUser();
    } catch {
      showToast("Error saving reel");
    }
  };

  const handleOrder = (e) => {
    e.stopPropagation();
    addToCart(food);
    showToast("Added to Cart! 🛒");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: food.name, text: `Check out ${food.name} on ReelBite!`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast("Link copied! 📎");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/api/foods/comment/${food._id}`, { text: newComment });
      setComments(res.data);
      setNewComment("");
      showToast("Comment posted!");
    } catch {
      showToast("Failed to post comment");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-0px)] sm:h-full max-w-[430px] mx-auto snap-center bg-black flex flex-col justify-center overflow-hidden flex-shrink-0 group">
      
      {/* ── Toast ── */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[var(--glass-bg)] backdrop-blur-md text-[var(--text-primary)] px-4 py-2 rounded-full flex items-center space-x-2 border border-[var(--border-color)] animate-fade-in shadow-lg">
          <CheckCircle className="w-4 h-4 text-[var(--brand-orange)] flex-shrink-0" />
          <span className="text-sm font-semibold whitespace-nowrap">{toast}</span>
        </div>
      )}

      {/* ── VIDEO CONTAINER (Forced Mobile Ratio via CSS) ── */}
      <div className="absolute inset-0 bg-[var(--bg-primary)] flex items-center justify-center">
          <video
            ref={videoRef}
            src={food.videoUrl}
            loop
            muted // Muted required for auto-play policy on most devices initially
            playsInline
            // OPTIMIZATION: Predictive preloading for active and next reel
            preload={(isActive || isNext) ? "auto" : "metadata"}
            className="w-full h-full object-cover sm:rounded-none" // object-cover forces the horizontal web videos acting as vertical to crop
            onCanPlay={() => setVideoLoaded(true)}
            onClick={handleSingleOrDoubleTap}
          />
      </div>

      {/* Loading / poster image shown ONLY before video loads */}
      {!videoLoaded && food.imageUrl && (
        <img
          src={food.imageUrl}
          alt={food.name}
          className="absolute inset-0 w-full h-full object-cover blur-sm brightness-50 z-0 transition-opacity duration-500"
        />
      )}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="w-10 h-10 border-2 border-[#FC8019]/30 border-t-[#FC8019] rounded-full animate-spin" />
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-[var(--glass-bg)] rounded-full p-6 backdrop-blur-sm animate-fade-in border border-[var(--border-color)]">
            <Play className="w-14 h-14 text-[var(--brand-orange)] fill-[var(--brand-orange)] ml-2" />
          </div>
        </div>
      )}

      {/* Double-tap heart */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <Heart fill="#FC8019" className="w-32 h-32 text-[#FC8019] opacity-90 animate-like-pump drop-shadow-2xl" />
        </div>
      )}

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/90 via-[var(--bg-primary)]/20 to-transparent pointer-events-none" />

      {/* ── Bottom Info ── */}
      {/* Changed bottom padding to avoid nav overlap (bottom-24 instead of bottom-6) */}
      <div className="absolute bottom-24 left-4 right-16 z-20 pointer-events-auto" onClick={e => e.stopPropagation()}>
        
        {/* Badges */}
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-5 h-5 rounded-sm border-[1.5px] flex items-center justify-center ${food.isVeg ? "border-[#3D9970] bg-[#3D9970]/10" : "border-[#E23744] bg-[#E23744]/10"}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? "bg-[#3D9970]" : "bg-[#E23744]"}`} />
          </div>
          {food.cuisine && food.cuisine !== "Other" && (
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white shadow-sm">
              {food.cuisine}
            </span>
          )}
        </div>

        <h2 className="text-[22px] font-extrabold text-[var(--text-primary)] mb-1 drop-shadow-md leading-tight">{food.name}</h2>

        {/* Restaurant */}
        <button
          onClick={() => navigate(`/home?search=${encodeURIComponent(food.restaurant)}`)}
          className="flex items-center space-x-1 text-[var(--text-primary)]/90 bg-[var(--bg-surface)] border border-[var(--border-color)] backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] mb-3 hover:bg-[var(--bg-surface)]/80 transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-[var(--brand-orange)]" />
          <span className="font-bold">{food.restaurant}</span>
        </button>

        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 mb-4 font-medium max-w-[90%]">
            {food.description || "Fresh and delicious food made with love."}
        </p>

        <div className="flex items-center space-x-3">
          <span className="text-xl font-black text-[var(--text-primary)] drop-shadow-md">
            ₹{food.price}
          </span>
          <button
            onClick={handleOrder}
            className="bg-[var(--brand-orange)] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            <span>ADD</span>
          </button>
        </div>
      </div>

      {/* ── Right Action Bar ── */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4 z-20 pb-2">
        {/* Profile mock icon */}
        <button 
             onClick={() => navigate(`/home?search=${encodeURIComponent(food.restaurant)}`)}
             className="relative mb-2 shrink-0 group active:scale-95 transition-transform"
        >
             <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-[#2A2A2A] shadow-lg">
                 {food.imageUrl ? <img src={food.imageUrl} className="w-full h-full object-cover" alt="creator" /> : <div className="bg-white" />}
             </div>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--brand-orange)] rounded-full w-4 h-4 flex items-center justify-center border border-white">
                 <Plus className="w-3 h-3 text-white" />
             </div>
        </button>

        {/* Like */}
        <button onClick={toggleLike} className="flex flex-col items-center group">
          <Heart className={`w-8 h-8 transition-all drop-shadow-lg ${isLiked ? "text-[#E23744] fill-[#E23744] scale-110" : "text-[var(--text-primary)]"}`} />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">{likesCount}</span>
        </button>

        {/* Comments */}
        <button onClick={() => setShowComments(v => !v)} className="flex flex-col items-center group">
          <MessageCircle className="w-8 h-8 text-[var(--text-primary)] drop-shadow-lg" />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">{comments.length}</span>
        </button>

        {/* Save */}
        <button onClick={toggleSave} className="flex flex-col items-center group">
          <Bookmark className={`w-7 h-7 transition-all drop-shadow-lg ${isSaved ? "text-yellow-400 fill-yellow-400" : "text-[var(--text-primary)]"}`} />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">Save</span>
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center group">
          <Send className="w-7 h-7 text-[var(--text-primary)] drop-shadow-lg transform -rotate-12" />
          <span className="text-[var(--text-primary)] text-[11px] font-bold mt-1 drop-shadow-md">Share</span>
        </button>
      </div>

      {/* ── Comments Panel ── */}
      <div 
         className={`absolute bottom-0 w-full bg-[var(--bg-surface)] rounded-t-3xl border-t border-[var(--border-color)] z-30 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${showComments ? 'translate-y-0 h-[65%]' : 'translate-y-full h-0'}`}
         onClick={e => e.stopPropagation()}
      >
        {showComments && (
           <>
          <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] shrink-0">
            <h3 className="font-bold text-[var(--text-primary)]">Comments <span className="text-xs text-[var(--text-secondary)]">({comments.length})</span></h3>
            <button onClick={() => setShowComments(false)} className="p-1.5 bg-[var(--text-primary)]/5 rounded-full hover:bg-[var(--text-primary)]/10 transition-colors">
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-20">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] space-y-2 pb-10">
                  <MessageCircle className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--brand-orange)] to-[#E23744] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {(c.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold mb-0.5">{c.user?.name || "Anonymous User"}</p>
                    <p className="text-[13px] text-[var(--text-primary)] bg-[var(--text-primary)]/5 border border-[var(--border-color)] px-3 py-2 rounded-2xl rounded-tl-none inline-block shadow-sm">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={submitComment} className="absolute bottom-0 left-0 right-0 p-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex items-center space-x-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[var(--text-primary)]/10 flex-shrink-0 flex items-center justify-center text-[var(--text-primary)] font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full py-2.5 px-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-orange)]/50 placeholder-[var(--text-secondary)] transition-colors"
            />
            <button type="submit" disabled={!newComment.trim()} className="p-2.5 text-white disabled:text-gray-500 bg-[var(--brand-orange)] disabled:bg-[var(--text-primary)]/10 rounded-full transition-colors disabled:cursor-not-allowed">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          </>
        )}
      </div>

    </div>
  );
};


// ─────────────────────────────────────────────
// Reels Page Container
// ─────────────────────────────────────────────
export default function ReelsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState("all");

  const containerRef = useRef(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("/api/foods?limit=40");
      setFoods(res.data);
    } catch {
      console.error("Error loading foods");
    } finally {
      setLoading(false);
    }
  };

  // Setup Intersection Observer to detect which reel is active
  useEffect(() => {
    if (loading || foods.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                // Determine index via DOM child position
                const index = Array.from(containerRef.current.children).indexOf(entry.target);
                setActiveIndex(index);
            }
        });
    }, {
        root: containerRef.current,
        threshold: 0.7 // TRIGGER FASTER: When 70% is visible
    });

    const elements = containerRef.current.children;
    for(let i=0; i<elements.length; i++) {
        observer.observe(elements[i]);
    }

    return () => observer.disconnect();
  }, [loading, foods]);

  if (loading) {
    return (
      <div className="h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-[var(--text-primary)] space-y-4">
        <div className="w-12 h-12 border-[3px] border-[var(--border-color)] border-t-[var(--brand-orange)] rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm font-bold tracking-widest uppercase">Loading Reels</p>
      </div>
    );
  }

  const filteredFoods = foods.filter(food => {
      if (filter === "veg") return food.isVeg;
      if (filter === "nonveg") return !food.isVeg;
      return true;
  });

  return (
    // The container forces background to follow the theme
    // snap-container setup exists in global css
    <div className="bg-[var(--bg-primary)] w-full fixed inset-0 z-10 overflow-hidden transition-colors duration-300">
      
      {/* Top Filter Overlay */}
      <div className="absolute top-12 md:top-20 left-0 right-0 z-50 flex justify-center items-center">
          <div className="flex items-center space-x-2 bg-[var(--glass-bg)] backdrop-blur-xl px-2 py-1.5 rounded-[2rem] border border-[var(--border-color)] shadow-xl">
              <button 
                onClick={() => setFilter("all")} 
                className={`text-[13px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all duration-300 ${filter === "all" ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xl" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                For You
              </button>
              
              <button 
                onClick={() => setFilter("veg")} 
                className={`text-[13px] font-black uppercase tracking-widest px-6 py-2 rounded-full flex items-center transition-all duration-300 ${filter === "veg" ? "bg-[#3D9970] text-white shadow-xl shadow-[#3D9970]/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                Veg
              </button>
              
              <button 
                onClick={() => setFilter("nonveg")} 
                className={`text-[13px] font-black uppercase tracking-widest px-6 py-2 rounded-full flex items-center transition-all duration-300 ${filter === "nonveg" ? "bg-[#E23744] text-white shadow-xl shadow-[#E23744]/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                Non-Veg
              </button>
          </div>
      </div>

      <div 
         ref={containerRef}
         className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar sm:py-4 pt-4 md:pt-16"
      >
        {filteredFoods.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center bg-transparent pointer-events-none text-[var(--text-secondary)]/50">
            <div className="text-center">
              <p className="text-5xl mb-4">🎬</p>
              <h3 className="text-xl mb-2 font-black text-[var(--text-primary)] tracking-tight">No Reels Found</h3>
              <p className="text-sm font-medium">Cannot find any reels for this filter.</p>
            </div>
          </div>
        ) : (
          filteredFoods.map((food, index) => (
            <Reel 
              key={food._id} 
              food={food} 
              isActive={index === activeIndex} 
              isNext={index === activeIndex + 1} // PREDICTIVE: true for the next card
            />
          ))
        )}
      </div>
    </div>
  );
}