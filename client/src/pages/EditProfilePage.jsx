import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  CheckCircle2,
  Lock
} from "lucide-react";
import API from "../api/api";

export default function EditProfilePage() {
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking the update request - assuming the endpoint exists or will handle it
      // In a real app, this would be axios.put("/api/auth/profile", formData);
      // For now, we simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If the backend supported it:
      // await axios.put("/api/auth/user/update", formData);
      // await fetchUser();
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16 pb-24 transition-colors">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-widest text-[var(--text-primary)]">Edit Profile</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--brand-orange)] to-[var(--brand-yellow)] p-1 shadow-2xl shadow-orange-500/20">
              <div className="w-full h-full rounded-full bg-[var(--bg-surface)] flex items-center justify-center overflow-hidden">
                {user?.name ? (
                  <span className="text-4xl font-black text-[var(--brand-orange)]">{user.name.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className="w-12 h-12 text-[var(--text-secondary)]" />
                )}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-[var(--bg-primary)]">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Change Profile Photo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[var(--brand-orange)] transition-all font-bold text-[var(--text-primary)]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[var(--brand-orange)] transition-all font-bold text-[var(--text-primary)] disabled:opacity-50"
                disabled
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]/30" />
            </div>
            <p className="text-[9px] text-[var(--text-secondary)] ml-2 italic">Email cannot be changed for security reasons.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[var(--brand-orange)] transition-all font-bold text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">Delivery Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-[var(--text-secondary)]" />
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
                className="w-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[var(--brand-orange)] transition-all font-bold text-[var(--text-primary)] resize-none"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading || success}
              className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                success 
                ? "bg-[#3D9970] text-white" 
                : "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--brand-orange)]"
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                  <span>Profile Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] border-dashed text-center">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </p>
        </div>
      </div>
    </div>
  );
}
