import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, MapPin, ChevronDown, Utensils } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TopBar() {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide TopBar entirely on auth pages
  if (["/login", "/register"].includes(location.pathname)) return null;
  const isReels = location.pathname === "/reels";
  const isLanding = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className={`fixed top-0 w-full glass-panel h-16 z-50 bg-white/95 border-b border-black/5 ${isReels ? 'hidden md:block' : ''}`}>
      <div className="flex justify-between items-center h-full px-4 md:px-8 max-w-md md:max-w-7xl mx-auto relative">
        
        {/* Left Side: Location */}
        <div className={`flex items-center space-x-6 z-10 ${isLanding ? 'invisible' : ''}`}>
            <div 
               className="flex flex-col justify-center cursor-pointer hover:opacity-80 transition-opacity"
               onClick={() => {
                   const newAddr = window.prompt("Enter new delivery location (Mock)", user?.address || "");
                   if (newAddr && newAddr.trim() !== "") {
                       alert("Location updated to: " + newAddr);
                   }
               }}
            >
                <div className="flex items-center space-x-1">
                    <MapPin className="w-5 h-5 sm:w-4 sm:h-4 text-[#FC8019] fill-[#FC8019]/10" />
                    <h2 className="font-bold text-base sm:text-sm text-[#1C1C1C] tracking-tight flex items-center">
                        Delivery <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                    </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 truncate max-w-[200px] ml-6 sm:ml-5 font-medium">
                     {user?.address || "Delivery location"}
                </p>
            </div>
        </div>

        {/* Center: Brand */}
        <div className="absolute left-1/2 -translate-x-1/2 z-0">
          <div 
             className="flex items-center gap-2 cursor-pointer group"
             onClick={() => navigate('/home')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FC8019] to-[#FFB01F] flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Utensils className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
            </div>
            <h1 className="font-black text-xl md:text-2xl tracking-tight text-[#1C1C1C]">Quick<span className="text-[#FC8019]">Bites</span></h1>
          </div>
        </div>
        
        {/* Right Side: Profile & Logout */}
        {user && !isLanding && (
          <div className="flex items-center space-x-4 sm:space-x-3 z-10">
             <div 
               className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-[#1C1C1C]/5 border border-black/5 flex items-center justify-center text-[#FC8019] font-black text-sm sm:text-xs cursor-pointer hover:bg-black/10 transition-colors"
               onClick={() => navigate('/profile')}
             >
                {getInitials(user.name)}
             </div>
             
             <button
              onClick={handleLogout}
              className="p-2 sm:p-1.5 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
             >
              <LogOut className="w-4 h-4 text-gray-500" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
