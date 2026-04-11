import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LogOut, Package, MapPin, Phone, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen px-4 py-8 pt-20">
      
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-[2.5rem] flex items-center space-x-6 mb-10 shadow-xl shadow-black/[0.03] border border-black/[0.03]">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#FC8019] to-[#FFB01F] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-orange-500/20">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1C1C1C] tracking-tighter leading-tight">{user?.name}</h2>
          <p className="text-gray-400 font-bold text-sm">{user?.email}</p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-[#FC8019]/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#FC8019]">
                {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3 shadow-sm border border-black/5 group hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-[#FC8019]/10 transition-colors">
            <Phone className="w-6 h-6 text-[#FC8019]" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Phone</div>
            <div className="text-sm font-black text-[#1C1C1C]">{user?.phone || "Not set"}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3 shadow-sm border border-black/5 group hover:shadow-xl transition-all duration-300">
           <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-[#FC8019]/10 transition-colors">
            <MapPin className="w-6 h-6 text-[#FC8019]" />
          </div>
          <div className="overflow-hidden w-full px-2">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Address</div>
            <div className="text-sm font-black text-[#1C1C1C] truncate">{user?.address || "Not set"}</div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-[#1C1C1C] tracking-tight flex items-center">
             <Package className="mr-3 text-[#FC8019]" /> Recent Orders
          </h3>
          <div className="h-[2px] w-12 bg-black/5 rounded-full" />
      </div>
      
      {loading ? (
        <div className="space-y-6 animate-pulse">
           {[1,2].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] border border-black/5"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-[2.5rem] border border-black/5 shadow-sm">
           <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-10 h-10 text-gray-300" />
           </div>
           <p className="text-[#1C1C1C] font-black text-lg">No orders yet</p>
           <p className="text-gray-400 text-sm mt-1 mb-8">Ready to discover something delicious?</p>
           <button onClick={() => navigate('/home')} className="bg-[#1C1C1C] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Browse Menu</button>
        </div>
      ) : (
        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 pb-32">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FC8019]/5 to-transparent -mr-8 -mt-8 rounded-full" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</div>
                    <div className="text-xs font-black text-[#1C1C1C] tracking-tighter">#{order._id.substring(order._id.length - 8)}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                    order.status === 'Delivered' ? 'bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/10' : 
                    order.status === 'Cancelled' ? 'bg-[#E23744]/10 text-[#E23744] border-[#E23744]/10' :
                    order.status === 'Pending' ? 'bg-orange-100 text-[#FC8019] border-orange-100' : 'bg-blue-50 text-blue-500 border-blue-50'
                  }`}>
                    {order.status}
                  </div>
                  {order.status === "Pending" && (
                     <button onClick={() => cancelOrder(order._id)} className="text-[10px] font-black text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors uppercase tracking-widest">Cancel Order</button>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 mb-8 relative z-10">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                       <span className="text-sm font-black text-[#1C1C1C] leading-tight">{item.food?.name || "Premium Dish"}</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-black/[0.03] mt-auto relative z-10">
                <span className="text-gray-400 font-bold text-xs">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                <span className="font-black text-xl tracking-tighter text-[#1C1C1C]">₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Logout Action */}
      <button 
        onClick={handleLogout}
        className="mt-4 w-full bg-white border border-black/5 flex items-center justify-center space-x-3 p-5 rounded-[2rem] text-red-500 hover:bg-red-50 transition-all shadow-xl shadow-black/[0.02] active:scale-95 group mb-20"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-black text-sm uppercase tracking-widest">Sign Out Securely</span>
      </button>

    </div>
  );
}
