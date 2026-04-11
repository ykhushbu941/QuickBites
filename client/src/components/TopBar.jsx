import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, MapPin, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TopBar() {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide TopBar on reels, auth pages
  if (["/login", "/register", "/reels"].includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="fixed top-0 w-full glass-panel h-16 z-40 bg-brand-dark/98 border-b border-white/5">
      <div className="flex justify-between items-center h-full px-4 max-w-md mx-auto">
        
        {/* Left Side: Deliver To */}
        <div 
           className="flex flex-col justify-center cursor-pointer hover:opacity-80 transition-opacity"
           onClick={() => {
               const newAddr = window.prompt("Enter new delivery location (Mock)", user?.address || "");
               if (newAddr && newAddr.trim() !== "") {
                   alert("Location updated to: " + newAddr);
                   // Full implementation would update backend and context
               }
           }}
        >
            <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-[#FC8019] fill-[#FC8019]/20" />
                <h1 className="font-bold text-sm text-white tracking-tight flex items-center">
                    Home <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
                </h1>
            </div>
            <p className="text-[10px] text-gray-400 truncate max-w-[200px] ml-5">
                 {user?.address || "Select a delivery location"}
            </p>
        </div>
        
        {/* Right Side: Profile & Logout */}
        {user && (
          <div className="flex items-center space-x-3">
             <div 
               className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-xs shadow-md shadow-brand-primary/20 cursor-pointer"
               onClick={() => navigate('/profile')}
             >
                {getInitials(user.name)}
             </div>
             
             <button
              onClick={handleLogout}
              className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
             >
              <LogOut className="w-4 h-4 text-gray-300" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
