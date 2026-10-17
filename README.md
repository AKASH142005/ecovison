# EcoVision - Tamil Nadu Waste Management & Collector GPS Navigation System

**EcoVision** is a smart circular-economy platform designed for Tamil Nadu, connecting citizens and businesses with certified waste recovery and recycling hubs. Users can manually filter by waste categories (Plastics, E-Waste, Organic/Wet Waste, Scrap Metals, Paper & Cardboard, Glass, Textiles, Hazardous) to find the closest collection facilities across Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, Vellore, Tiruppur, Erode, etc.) with real-time distance calculations, drive time estimates, and turn-by-turn Google Maps navigation.

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React 18** with **Vite**
  - **Material UI (MUI)** (`@mui/material`, `@emotion/react`, `@emotion/styled`)
  - **Tailwind CSS** (custom modern dark eco theme, glassmorphism)
  - **Leaflet & React-Leaflet** with custom SVG markers, dynamic navigation route polylines, and OpenStreetMap / CartoDB tiles
  - **Lucide Icons** & **Canvas Confetti**
- **Backend**:
  - **Fastify** high-performance Node.js framework
  - **Mongoose & MongoDB** with resilient in-memory fallback preloaded with authentic Tamil Nadu recycling facilities
  - **@fastify/cors** & **dotenv**

---

## 🚀 Key Features

1. **Manual Waste Type Selector**:
   - 🧃 **Plastics & Polymers** (PET, HDPE, LDPE)
   - 💻 **E-Waste & Electronics** (Smartphones, PCBs, Batteries)
   - 🍏 **Organic & Food Waste** (Compostable biomass, Biogas)
   - 🥫 **Metals & Scrap Alloys** (Aluminum cans, Steel, Copper)
   - 📦 **Paper & Cardboard** (Packaging cartons, Newspapers)
   - 🍶 **Glass & Cullet** (Beverage bottles, Cullet jars)
   - 👕 **Textiles & Fabric** (Tiruppur knit offcuts, Cotton garments)
   - ☣️ **Hazardous & Medical** (TNPCB secure disposal)
2. **Tamil Nadu Interactive Map Navigation**:
   - Leaflet map centered on Tamil Nadu with custom pins
   - Live distance in km (Haversine formula) and estimated driving time
   - Dynamic route polyline connecting user origin to the nearest collector
   - One-click **"Open in Google Maps GPS"** for live turn-by-turn navigation
3. **Quick District Selector**:
   - Instantly switch origins to **Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, Vellore, Tiruppur, Erode, Thanjavur, Dindigul, Kanchipuram**.
4. **Drop-Off & Doorstep Pickup Scheduling**:
   - Schedule drop-offs or doorstep collection with live calculation of cash rewards (₹) and CO2 emissions offset (kg).
   - Generates tracking codes (`ECO-TN-XXXXXX`).
5. **TNPCB Verified Network**:
   - Verified registration IDs, depot capacity meters, operating hours, phone helplines, and daily market rates per kg.

---

## 🏃 Getting Started

### 1. Installation
Install all dependencies for root, backend, and frontend:
```bash
npm run install:all
```

### 2. Run the Full-Stack Application
To start both the Fastify server (`http://localhost:5000`) and the React Vite client (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

### 3. Individual Service Commands
- **Backend Only**:
  ```bash
  npm run server
  ```
- **Frontend Only**:
  ```bash
  npm run client
  ```

---

## 📡 API Endpoints

- `GET /api/health` - Server & database connectivity status
- `GET /api/collectors` - Filter collectors by `wasteType`, `district`, `lat`, `lng`, `search`
- `GET /api/collectors/:id` - Detailed collector profile
- `POST /api/collectors/nearest` - Compute nearest collectors with routing metrics
- `GET /api/districts` - List Tamil Nadu districts with registered collector counts
- `GET /api/categories` - Waste categories, recycling advice, and baseline payout rates
- `POST /api/bookings` - Create drop-off or doorstep pickup request
- `GET /api/bookings` - Retrieve user bookings
- `GET /api/stats` - Tamil Nadu state-wide environmental metrics
