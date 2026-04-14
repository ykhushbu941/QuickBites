import { useEffect, useState } from "react";
import API from "../api/api";
import { Package, Clock, CheckCircle, Truck, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/partner");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch partner orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const StatusButton = ({ order, status, icon: Icon, label, colorClass }) => {
    const isActive = order.status === status;
    return (
      <motion.button 
        whileHover={!isActive && order.status !== "Cancelled" ? { scale: 1.05 } : {}}
        whileTap={!isActive && order.status !== "Cancelled" ? { scale: 0.95 } : {}}
        onClick={() => updateStatus(order._id, status)}
        disabled={isActive || order.status === "Cancelled"}
        className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition-all ${
          isActive 
            ? `${colorClass} shadow-lg scale-105 text-white` 
            : "bg-[var(--text-primary)]/5 text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10"
        } ${order.status === "Cancelled" ? "opacity-30 cursor-not-allowed" : ""}`}
      >
        <Icon className="w-5 h-5 mb-1" />
        {label}
      </motion.button>
    );
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="max-w-md md:max-w-6xl mx-auto min-h-screen px-4 py-8 pb-24 bg-[var(--bg-primary)] transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-black text-[var(--text-primary)] mb-1">Partner Dashboard</h1>
        <p className="text-[var(--brand-orange)] text-sm font-black uppercase tracking-widest">Manage incoming orders</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
           {[1,2,3].map(i => <div key={i} className="h-40 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-surface)] p-12 text-center rounded-[2.5rem] border border-[var(--border-color)] shadow-xl mt-12"
        >
           <Package className="w-16 h-16 text-[var(--brand-orange)]/50 mx-auto mb-4" />
           <h2 className="text-xl font-black text-[var(--text-primary)] mb-2">No active orders</h2>
           <p className="text-[var(--text-secondary)] text-sm font-medium">When users order your dishes, they will appear here for you to manage.</p>
        </motion.div>
      ) : (
        <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
        >
          {orders.map((order) => (
            <motion.div 
              key={order._id} 
              variants={itemFadeUp}
              layout
              className={`bg-[var(--bg-surface)] p-5 rounded-[2rem] border-l-[6px] h-full flex flex-col justify-between shadow-xl shadow-black/[0.02] border border-[var(--border-color)] transition-all ${
                order.status === 'Cancelled' ? 'border-l-red-500 bg-red-500/[0.03] opacity-75' : 'border-l-[var(--brand-orange)]'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4 pb-3 border-b border-[var(--border-color)]">
                <div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-wider mb-1">
                    Order #{order._id.substring(order._id.length - 6)}
                  </div>
                  <h3 className="font-black text-[var(--text-primary)] text-lg tracking-tight">{order.user?.name || "Customer"}</h3>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center space-x-1 mt-0.5">
                    <span className="truncate max-w-[200px]">{order.deliveryAddress || order.user?.address || "No address provided"}</span>
                  </p>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${
                    order.status === 'Delivered' ? 'bg-[#3D9970]/10 text-[#3D9970] border-[#3D9970]/10' : 
                    order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                    order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]'
                  }`}>
                    {order.status}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-5 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-3">
                       <span className="text-[var(--brand-orange)] font-black bg-[var(--brand-orange)]/10 px-2.5 py-1 rounded text-[10px] tracking-tight">{item.quantity}x</span> 
                       <span className="text-[var(--text-primary)] font-black tracking-tight">{item.food?.name || "Unknown Item"}</span>
                    </div>
                    <span className="text-[var(--text-secondary)] font-mono text-xs">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Status Pipeline Buttons */}
              {order.status !== 'Cancelled' ? (
                <div className="flex space-x-2">
                  <StatusButton order={order} status="Pending" icon={Clock} label="Pending" colorClass="bg-yellow-500" />
                  <StatusButton order={order} status="Preparing" icon={Package} label="Cooking" colorClass="bg-blue-500" />
                  <StatusButton order={order} status="Out for Delivery" icon={Truck} label="Out" colorClass="bg-purple-500" />
                  <StatusButton order={order} status="Delivered" icon={CheckCircle} label="Done" colorClass="bg-[#3D9970]" />
                </div>
              ) : (
                <div className="text-center text-red-500 text-xs font-black bg-red-500/10 py-3 rounded-xl uppercase tracking-widest">
                   Order Cancelled
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}