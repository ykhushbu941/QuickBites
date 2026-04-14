# 🎬 ReelBite: Project Intelligence & Architecture Overview

ReelBite is a next-generation food discovery and ordering platform that replaces static menus with immersive, short-form video reels. It is designed to bridge the gap between social media engagement and instant food commerce.

---

## 🚀 Core Philosophy
**"Discover food, one reel at a time."**
Unlike traditional delivery apps, ReelBite focuses on visual appetite-triggering discovery. Users scroll through high-fidelity video content (Food Reels) to discover dishes, which they can instantly order, like, or save.

---

## 🏗️ Technical Architecture

### 1. Unified Frontend (React + Vite)
- **Framework**: React 18 with high-performance Vite tooling.
- **Aesthetics**: Custom **Glassmorphism Design System** featuring translucent overlays, vibrant gradients, and premium typography (Outfit/Inter).
- **Animations**: Driven by **Framer Motion** for spring-physics interactions and smooth page transitions.
- **Video Engine**: Optimized HTML5 Video implementation for buffer-free local reel playback.

### 2. Scalable Backend (Express + Node.js)
- **API Design**: RESTful architecture with structured error handling and global crash protection.
- **Security**: JWT-based stateless authentication with role-based access control (RBAC).
- **Storage**: Highly efficient **LowDB** implementation. This provides a local JSON-based file persistence that ensures lightning-fast read/write operations for low-tier hosting environments like Render.

### 3. Production Deployment
- **Frontend**: [Vercel Deployment](https://quick-bites-y9td-q0u4i9bds-ykhushbu941s-projects.vercel.app/)
- **Backend**: [Render API](https://quickbites-backend-738z.onrender.com/) — Enabled with root diagnostics.

---

## 🔥 Key Feature Sets

### 📱 For the Foodie (User)
- **Infinite Discovery Feed**: A vertical scroll of delicious food reels.
- **Category Explorer**: 10+ cuisine types upgraded from emojis to professional photography.
- **Premium Checkout**: A sleek, multi-step payment and cart system.
- **Order Tracking**: Real-time status updates from the restaurant.

### 👨‍🍳 For the Partner (Restaurant)
- **Management Dashboard**: A dedicated portal to track incoming orders in real-time.
- **Workflow Pipeline**: Advanced status management (Pending → Preparing → Out for Delivery → Delivered).
- **Product Management**: Ability to add new dishes and upload reels.

---

## 🛠️ Production-Grade Hardening
*Recently implemented stability improvements:*

- **Role Persistence**: Fixed critical session logic to ensure partner accounts never lose status on refresh.
- **Visual Guarantee (v4)**: Migrated 100% of assets to global CDN (Unsplash) for zero broken images.
- **Proxy Optimization**: Refined `vercel.json` to eliminate 502/404 errors during client-server communication.
- **Crash Recovery**: Added `uncaughtException` handlers in `server.js` to keep the backend alive during storage events.

---

## 🔑 Demo Credentials

**Partner/Restaurant Admin:**
- **Email**: `partner@reelbite.com`
- **Password**: `12345`

---

## 🔮 Roadmap & AI Potential
- **Taste Profile AI**: Learning user preferences from reel interaction times.
- **NL Search**: Natural language query handling (e.g., "Something spicy for a rainy night").
- **Group Carts**: Collaborative ordering with real-time bill splitting.

---

*This document serves as the technical source of truth for the ReelBite Production Environment.*
