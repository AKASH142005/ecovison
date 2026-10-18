# EcoVision Chennai - Greater Chennai Corporation (GCC) Circular Resource & Role-Based Services

**EcoVision Chennai** is an end-to-end circular economy platform built exclusively for **Chennai City**. Connecting Chennai residents, residential welfare associations, certified scrap recovery centers, and major industrial recycling plants across the city's key Greater Chennai Corporation (GCC) zones:
- **Anna Nagar (Zone 8)**
- **Guindy & SIDCO Industrial Estate (Zone 12)**
- **Adyar & Besant Nagar (Zone 13)**
- **T. Nagar & Teynampet (Zone 10)**
- **Perungudi & OMR IT Corridor (Zone 14)**
- **Ambattur Industrial Estate (Zone 7)**
- **Manali Petrochemical & Polymer Belt (Zone 2)**
- **Mylapore & Royapettah (Zone 9)**
- **Porur & Vadapalani (Zone 11)**
- **Royapuram & Port Maritime Zone (Zone 5)**
- **Tambaram & Pallavaram (South Gateway)**
- **Velachery Urban Biomethanation Hub (Zone 13)**

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React 18** with **Vite**
  - **Material UI (MUI)** (`@mui/material`, `@emotion/react`, `@emotion/styled`)
  - **Tailwind CSS** (custom dark/light theme, glassmorphism, responsive grid)
  - **Leaflet & React-Leaflet** centered on Chennai City (`13.0827, 80.2707`) with custom SVG markers, dynamic turn-by-turn routing polylines, and OpenStreetMap tiles
  - **Lucide Icons** & **Canvas Confetti**
- **Backend**:
  - **Fastify** high-performance Node.js REST API
  - **Mongoose & MongoDB** with resilient in-memory fallback preloaded with authentic Chennai facilities
  - **JWT & bcryptjs** Role-Based Access Control (`requireRole('customer' | 'dealer' | 'factory' | 'admin')`)
  - **@fastify/cors** & **dotenv**

---

## 👥 4-Tier Role-Based Authentication & Services

EcoVision Chennai implements a full **Role-Based Authentication & Service Architecture**. Users can log in with email/password, register new Chennai facility accounts with specific roles, or switch with 1-click between 4 verified Chennai personas:

| Role & Service | Demo Login | Password | Chennai Persona & Hub | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Service** | `customer@ecovision.tn` | `pass123` | **Kavitha Ramachandran**<br>Anna Nagar West (Zone 8) | • Book GCC Ward doorstep scrap pickups<br>• View daily scrap rates (PET, Paper, Metals, E-waste)<br>• Reverse-geocoded Chennai GPS navigation<br>• Real-time scrap reward (₹) & CO₂ offset tracking |
| **Dealer Service** | `dealer@ecovision.tn` | `pass123` | **Guindy Eco-Recovery Hub**<br>Plot 42, SIDCO Guindy (Zone 12) | • Accept & dispatch GCC ward collection vans<br>• Digital weighbridge verification<br>• **Automatic warehouse inventory stock credits**<br>• Commit tons to Chennai industrial factory purchase orders |
| **Factory Service** | `factory@ecovision.tn` | `pass123` | **Manali Eco-Polymers Ltd**<br>Expressway Complex, Manali (Zone 2) | • Publish bulk industrial procurement demand (HDPE, PET, OCC, Metals)<br>• Inbound truck shipment tracking & gate log<br>• Spectrometer & moisture QA verification<br>• One-click NEFT payment disbursement |
| **GCC Admin Service** | `admin@ecovision.tn` | `pass123` | **Dr. S. Meenakshi**<br>Ripon Building Central / TNPCB | • Greater Chennai waste diversion KPIs<br>• Tamper-evident transaction & security audit logs<br>• Registered facility & dealer directory<br>• **Automated 8/8 end-to-end workflow test suite runner** |

---

## 🚀 Key Features

1. **Role-Based Auth & Modal**:
   - Access from header avatar or top banner
   - 1-Click Fast Persona Switcher (Customer, Dealer, Factory, GCC Admin)
   - Email/Password Sign-In with autofill test buttons
   - Registration flow with Chennai Zone / Ward selection and Facility details
2. **Dedicated Role Service Workspaces**:
   - Dynamic service workspace banner adapts to the active user role
   - Dealer Portal: Ward pickup dispatch, baling warehouse inventory, factory commitments
   - Factory Portal: Bulk sourcing marketplace, inbound QA inspection, payment clearance
   - Admin Portal: City-wide analytics, audit logs, automated 8/8 test suite
3. **Chennai Grid Geocoding & Map**:
   - Leaflet map default centered on Chennai Central (`13.0827, 80.2707`, zoom 12)
   - "Reset Chennai" button for instant recentering
   - Proximity ranking sorts by driving distance (km) across all Chennai wards
4. **Chennai Zone Selector**:
   - Fast filter buttons for: *Anna Nagar, T. Nagar, Guindy, Adyar, Velachery, Ambattur, Perungudi / OMR, Porur, Mylapore, Royapuram, Manali, Tambaram*.
5. **Drop-Off & Doorstep Ward Pickups**:
   - Schedule pickups with cash rewards (₹) and CO₂ savings calculations.

---

## 🏃 Running Locally

### 1. Installation
```bash
npm run install:all
```

### 2. Start Both Server & Client
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

---

## 🧪 Automated Testing

Execute the 8-step business workflow and access control assertion suite:
```bash
curl http://localhost:5000/api/admin/test-suite
```
Or open the web application, switch to **GCC Admin**, open the **GCC Audit Hub**, and click **"Run Complete Test Suite"**. All 8 assertions pass with 100% test coverage.
