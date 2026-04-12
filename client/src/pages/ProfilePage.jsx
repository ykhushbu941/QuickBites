import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LogOut, Package, MapPin, Phone, Coffee, Settings, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(`/api/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel order");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen px-4 py-8 pb-40 pt-20 bg-[var(--bg-primary)] transition-colors duration-300">
      
      {/* Profile Header */}
      <div className="bg-[var(--bg-surface)] p-8 rounded-[2.5rem] flex items-center space-x-6 mb-10 shadow-xl shadow-black/[0.03] border border-[var(--border-color)]">
        <div className="w-24 h-24 bg-gradient-to-tr from-[var(--brand-orange)] to-[var(--brand-yellow)] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-orange-500/20">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter leading-tight">{user?.name}</h2>
              <p className="text-[var(--text-secondary)] font-bold text-sm">{user?.email}</p>
            </div>
            <Link to="/edit-profile" className="p-3 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] hover:bg-[var(--brand-orange)]/10 hover:border-[var(--brand-orange)]/20 transition-all group">
               <Settings className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-orange)] transition-colors" />
            </Link>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-[var(--brand-orange)]/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[var(--brand-orange)]">
                {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-[var(--bg-surface)] p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3 shadow-sm border border-[var(--border-color)] group hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand-orange)]/5 flex items-center justify-center group-hover:bg-[var(--brand-orange)]/10 transition-colors">
            <Phone className="w-6 h-6 text-[var(--brand-orange)]" />
          </div>
          <div>
            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">Phone</div>
            <div className="text-sm font-black text-[var(--text-primary)]">{user?.phone || "Not set"}</div>
          </div>
        </div>
        <div className="bg-[var(--bg-surface)] p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3 shadow-sm border border-[var(--border-color)] group hover:shadow-xl transition-all duration-300">
           <div className="w-12 h-12 rounded-2xl bg-[var(--brand-orange)]/5 flex items-center justify-center group-hover:bg-[var(--brand-orange)]/10 transition-colors">
            <MapPin className="w-6 h-6 text-[var(--brand-orange)]" />
          </div>
          <div className="overflow-hidden w-full px-2">
            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest mb-1">Address</div>
            <div className="text-sm font-black text-[var(--text-primary)] truncate">{user?.address || "Not set"}</div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center">
             <Package className="mr-3 text-[var(--brand-orange)]" /> Recent Orders
          </h3>
          <div className="h-[2px] w-12 bg-[var(--border-color)] rounded-full" />
      </div>
      
      {loading ? (
        <div className="space-y-6 animate-pulse">
           {[1,2].map(i => <div key={i} className="h-32 bg-[var(--bg-surface)] rounded-[2rem] border border-[var(--border-color)]"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--bg-surface)] p-12 text-center rounded-[2.5rem] border border-[var(--border-color)] shadow-sm">
           <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-10 h-10 text-[var(--text-secondary)]/30" />
           </div>
           <p className="text-[var(--text-primary)] font-black text-lg">No orders yet</p>
           <p className="text-[var(--text-secondary)] text-sm mt-1 mb-8">Ready to discover something delicious?</p>
           <button onClick={() => navigate('/home')} className="bg-[var(--brand-orange)] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-orange-500/20">Browse Menu</button>
        </div>
      ) : (
        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 pb-10">
          {orders.map((order) => (
            <div 
              key={order._id} 
              onClick={() => navigate(`/track-order/${order._id}`)}
              className="bg-[var(--bg-surface)] p-6 rounded-[2rem] border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--brand-orange)]/5 to-transparent -mr-8 -mt-8 rounded-full" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Order ID</div>
                    <div className="text-xs font-black text-[var(--text-primary)] tracking-tighter">#{order._id.substring(order._id.length - 8)}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                    order.status === 'Delivered' ? 'bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/10' : 
                    order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/10' :
                    order.status === 'Pending' ? 'bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] border-[var(--brand-orange)]/10' : 'bg-blue-500/10 text-blue-500 border-blue-500/10'
                  }`}>
                    {order.status}
                  </div>
                  {order.status === "Pending" && (
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelOrder(order._id);
                        }} 
                        className="text-[10px] font-black text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 mb-8 relative z-10">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]/20" />
                       <span className="text-sm font-black text-[var(--text-primary)] leading-tight">{item.food?.name || "Premium Dish"}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-[var(--border-color)] mt-auto relative z-10">
                <div className="flex items-center gap-3">
                   <span className="text-[var(--text-secondary)] font-bold text-xs">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                   <div className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                   <span className="text-[10px] font-black text-[var(--brand-orange)] uppercase tracking-widest flex items-center group-hover:translate-x-1 transition-transform">Track <ChevronRight className="w-3 h-3 ml-0.5" /></span>
                </div>
                <span className="font-black text-xl tracking-tighter text-[var(--text-primary)]">₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Logout Action */}
      <button 
        onClick={handleLogout}
        className="mt-4 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center space-x-3 p-5 rounded-[2rem] text-red-500 hover:bg-red-500/5 transition-all shadow-xl shadow-black/[0.02] active:scale-95 group mb-20"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-black text-sm uppercase tracking-widest">Sign Out Securely</span>
      </button>

    </div>
  );
}
