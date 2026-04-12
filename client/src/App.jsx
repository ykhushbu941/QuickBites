import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

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
  return (
    <ThemeProvider>
      <div className="bg-[var(--bg-primary)] min-h-screen font-sans antialiased text-[var(--text-primary)] pb-32 pt-14 relative transition-colors duration-300">
        <TopBar />

      <Routes>
        {/* Splash / Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core App Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reels"
          element={
            <ProtectedRoute>
              <ReelsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order/:orderId"
          element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          }
        />

        {/* Partner Routing */}
        <Route
          path="/add"
          element={
            <PartnerRoute>
              <AddFood />
            </PartnerRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PartnerRoute>
              <PartnerDashboard />
            </PartnerRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      <BottomNavigation />
      </div>
    </ThemeProvider>
  );
}