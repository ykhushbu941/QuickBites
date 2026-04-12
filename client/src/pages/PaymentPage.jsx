import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  MapPin
} from "lucide-react";
import axios from "axios";

export default function PaymentPage() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = 40;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + deliveryFee + platformFee + gst;

  const handlePayment = async () => {
    // Validation
    if (selectedMethod === "upi" && !upiId.includes("@")) {
      alert("Please enter a valid UPI ID (e.g. name@bank)");
      return;
    }
    if (selectedMethod === "card" && cardDetails.number.length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          food: item.food._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        deliveryAddress: user?.address || "Default Address",
        paymentMethod: selectedMethod,
        onlinePaymentDetails: {
           upiId: selectedMethod === 'upi' ? upiId : undefined,
           cardLastFour: selectedMethod === 'card' ? cardDetails.number.slice(-4) : undefined
        },
        status: "Pending"
      };

      const response = await axios.post("/api/orders", orderData);
      
      // FIX: The backend returns the object directly, not wrapped in 'order'
      const orderId = response.data._id;
      
      if (!orderId) throw new Error("Order ID missing from response");

      clearCart();
      setTimeout(() => {
        navigate(`/track-order/${orderId}`);
      }, 1500);
    } catch (err) {
      alert("Payment failed. " + (err.response?.data?.msg || "Please try again."));
      console.error(err);
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">No items to pay for</h2>
        <button onClick={() => navigate("/home")} className="mt-4 btn-primary">Go Home</button>
      </div>
    );
  }

  const paymentMethods = [
    { id: "upi", name: "UPI (Google Pay, PhonePe, etc.)", icon: <Smartphone className="w-5 h-5" />, color: "bg-blue-500" },
    { id: "card", name: "Credit / Debit Card", icon: <CreditCard className="w-5 h-5" />, color: "bg-purple-500" },
    { id: "wallet", name: "Wallets (Paytm, Mobikwik)", icon: <Wallet className="w-5 h-5" />, color: "bg-orange-500" },
    { id: "cod", name: "Cash on Delivery", icon: <Banknote className="w-5 h-5" />, color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16 pb-24 transition-colors">
      {/* Header & Stepper */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black tracking-tight uppercase">Payment</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-8">
          <div className="flex flex-col items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs font-bold">
               <CheckCircle2 className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Address</span>
          </div>
          <div className="h-[2px] flex-grow mx-4 bg-[var(--text-primary)]" />
          <div className="flex flex-col items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[var(--brand-orange)] text-white flex items-center justify-center text-xs font-bold ring-4 ring-orange-500/10 transition-all scale-110">
               2
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-orange)]">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Payment Options */}
          <div className="md:col-span-7 space-y-6">
            <div className="card-surface p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] mb-6">Payment Methods</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="space-y-3">
                    <button
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        selectedMethod === method.id 
                        ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/5" 
                        : "border-[var(--border-color)] hover:border-[var(--text-secondary)]/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${method.color} shadow-lg shadow-black/5`}>
                          {method.icon}
                        </div>
                        <span className="font-bold text-[var(--text-primary)]">{method.name}</span>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-6 h-6 rounded-full bg-[var(--brand-orange)] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>

                    {/* Conditional Inputs */}
                    {selectedMethod === method.id && method.id === "upi" && (
                      <div className="mx-2 p-4 rounded-2xl bg-[var(--bg-primary)] border border-dashed border-[var(--brand-orange)]/30 animate-fade-in">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2 block">Enter UPI ID</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-orange)]" />
                          <input 
                            type="text" 
                            placeholder="e.g. mobile@upi or name@okaxis" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-orange-500/20 py-2 pl-9 outline-none focus:border-[var(--brand-orange)] transition-colors font-bold text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {selectedMethod === method.id && method.id === "card" && (
                      <div className="mx-2 p-4 rounded-2xl bg-[var(--bg-primary)] border border-dashed border-purple-500/30 animate-fade-in space-y-4">
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500" />
                          <input 
                            type="text" 
                            placeholder="16 Digit Card Number" 
                            maxLength={16}
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-transparent border-b-2 border-purple-500/20 py-2 pl-9 outline-none focus:border-purple-500 transition-colors font-bold text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            maxLength={5}
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            className="w-full bg-transparent border-b-2 border-purple-500/20 py-2 outline-none focus:border-purple-500 transition-colors font-bold text-sm text-center"
                          />
                          <input 
                            type="password" 
                            placeholder="CVV" 
                            maxLength={3}
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-transparent border-b-2 border-purple-500/20 py-2 outline-none focus:border-purple-500 transition-colors font-bold text-sm text-center"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6 flex items-center gap-4 text-[#3D9970] font-bold">
               <ShieldCheck className="w-6 h-6" />
               <p className="text-xs uppercase tracking-wider">100% SECURE PAYMENTS POWERED BY RAZORPAY</p>
            </div>
          </div>

          {/* Right: Summary & Confirmation */}
          <div className="md:col-span-5 space-y-6">
            <div className="card-surface p-6 sticky top-24">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-secondary)] mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={item.food._id} className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-secondary)] w-6">{item.quantity}x</span>
                      <span className="text-[var(--text-primary)] truncate max-w-[120px]">{item.food.name}</span>
                    </div>
                    <span className="text-[var(--text-primary)] font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-[var(--border-color)] border-dashed text-sm font-bold text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="text-[var(--text-primary)]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-[var(--text-primary)]">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Charges</span>
                  <span className="text-[var(--text-primary)]">₹{platformFee + gst}</span>
                </div>
                <div className="pt-4 flex justify-between items-center bg-[var(--bg-primary)] -mx-6 px-6 py-4 mt-2">
                  <span className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">To Pay</span>
                  <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter">₹{totalAmount}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                 <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                   <MapPin className="w-4 h-4 text-[var(--brand-orange)] mt-0.5 shrink-0" />
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-0.5">Delivering to</p>
                      <p className="text-xs font-bold text-[var(--text-primary)] line-clamp-2 leading-tight">{user?.address || "Address not provided"}</p>
                   </div>
                 </div>

                 <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-14 btn-primary relative overflow-hidden group flex items-center justify-center gap-3 active:scale-95 disabled:grayscale"
                 >
                   {loading ? (
                     <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <>
                        <span className="text-sm">CONFIRM & PAY ₹{totalAmount}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full screen success loader */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-center animate-fade-in">
           <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[var(--brand-orange)]/10" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-[var(--brand-orange)] border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldCheck className="w-10 h-10 text-[var(--brand-orange)]" />
              </div>
           </div>
           <h2 className="mt-8 text-xl font-black tracking-widest uppercase">Processing Payment</h2>
           <p className="text-sm text-[var(--text-secondary)] font-medium mt-2">Do not refresh this page</p>
        </div>
      )}
    </div>
  );
}
