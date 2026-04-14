import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "./components/PageTransition";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReelsPage from "./pages/ReelsPage";
import AddFood from "./pages/AddFood";
import PartnerDashboard from "./pages/PartnerDashboard";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import SavedPage from "./pages/SavedPage";
import PaymentPage from "./pages/PaymentPage";
import EditProfilePage from "./pages/EditProfilePage";
import TrackOrderPage from "./pages/TrackOrderPage";

import { ThemeProvider } from "./context/ThemeContext";

// Components
import TopBar from "./components/TopBar";
import BottomNavigation from "./components/BottomNavigation";

import LandingPage from "./pages/LandingPage";

// 🔐 Protected Route (User must be logged in)
function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="w-10 h-10 border-2 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!token) return <Navigate to="/login" />;
  
  return children;
}

// 👨‍🍳 Partner Route (Only partners allowed)
function PartnerRoute({ children }) {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="w-10 h-10 border-2 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!token) return <Navigate to="/login" />;
  if (role !== "partner") return <Navigate to="/home" />;

  return children;
}

export default function App() {
  const location = useLocation();
  return (
    <ThemeProvider>
      <div className="bg-[var(--bg-primary)] min-h-screen font-sans antialiased text-[var(--text-primary)] pb-32 pt-14 relative transition-colors duration-300 overflow-x-hidden">
        {/* Global Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--brand-orange)]/5 blur-[100px] rounded-full"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--brand-yellow)]/5 blur-[120px] rounded-full"
          />
        </div>

        <TopBar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Splash / Landing */}
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

          {/* Auth Routes */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

          {/* Core App Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <PageTransition><HomePage /></PageTransition>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reels"
            element={
              <ProtectedRoute>
                <PageTransition><ReelsPage /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <PageTransition><CartPage /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <PageTransition><SavedPage /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition><ProfilePage /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <PageTransition><EditProfilePage /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PageTransition><PaymentPage /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/track-order/:orderId"
            element={
              <ProtectedRoute>
                <PageTransition><TrackOrderPage /></PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Partner Routing */}
          <Route
            path="/add"
            element={
              <PartnerRoute>
                <PageTransition><AddFood /></PageTransition>
              </PartnerRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <PartnerRoute>
                <PageTransition><PartnerDashboard /></PageTransition>
              </PartnerRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AnimatePresence>

      <BottomNavigation />
      </div>
    </ThemeProvider>
  );
}