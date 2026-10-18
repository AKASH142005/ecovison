import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EcoVision - Complete Project Documentation & End-to-End Workflow</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.55;
      font-size: 10.5pt;
    }

    /* Cover / Header Section */
    .header-banner {
      background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%);
      color: #ffffff;
      padding: 28px 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      border: 1px solid #047857;
    }

    .badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.25);
      color: #a7f3d0;
      border: 1px solid rgba(16, 185, 129, 0.4);
      margin-bottom: 12px;
    }

    .header-title {
      font-size: 23pt;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 8px;
      color: #ffffff;
    }

    .header-title span {
      color: #34d399;
    }

    .header-subtitle {
      font-size: 11pt;
      color: #cbd5e1;
      max-width: 90%;
      line-height: 1.4;
    }

    .meta-bar {
      display: flex;
      gap: 16px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 8.5pt;
      color: #94a3b8;
    }

    .meta-bar strong {
      color: #ffffff;
    }

    /* Headings */
    h1 {
      font-size: 16pt;
      font-weight: 800;
      color: #064e3b;
      margin: 22px 0 10px 0;
      padding-bottom: 4px;
      border-bottom: 2px solid #10b981;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
      margin: 14px 0 6px 0;
    }

    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #047857;
      margin: 10px 0 4px 0;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
    }

    /* Cards & Containers */
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .card-title {
      font-weight: 700;
      font-size: 10.5pt;
      color: #065f46;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }

    th {
      background: #064e3b;
      color: #ffffff;
      text-align: left;
      padding: 7px 9px;
      font-weight: 700;
      border: 1px solid #064e3b;
    }

    td {
      padding: 6px 9px;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* Code Blocks */
    code {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8.5pt;
      background: #e2e8f0;
      padding: 1px 4px;
      border-radius: 3px;
      color: #0f172a;
    }

    pre {
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 8pt;
      background: #0f172a;
      color: #f1f5f9;
      padding: 10px 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 8px 0 12px 0;
      line-height: 1.4;
      page-break-inside: avoid;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }

    /* Lists */
    ul, ol {
      margin-left: 20px;
      margin-bottom: 10px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    /* Workflow Step Boxes */
    .workflow-step {
      display: flex;
      gap: 12px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #10b981;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }

    .step-number {
      background: #10b981;
      color: #ffffff;
      font-weight: 800;
      font-size: 10pt;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .step-content {
      flex: 1;
    }

    .step-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 10pt;
      margin-bottom: 3px;
    }

    .tag {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
      margin-right: 4px;
    }

    .tag-green {
      background: #dcfce7;
      color: #15803d;
      border-color: #bbf7d0;
    }

    .tag-amber {
      background: #fef3c7;
      color: #b45309;
      border-color: #fde68a;
    }

    .page-break {
      page-break-before: always;
    }

    .footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Cover Header -->
  <div class="header-banner">
    <div class="badge">TNPCB Certified Eco-Network • Circular Economy Platform</div>
    <h1 class="header-title">Eco<span>Vision</span> Tamil Nadu</h1>
    <p class="header-subtitle">
      Smart Waste Management, Collector GPS Navigation & Citizen Payout Platform
    </p>
    <div class="meta-bar">
      <div><strong>Platform:</strong> Full-Stack Web Application</div>
      <div><strong>Stack:</strong> React 18, Vite, Fastify, Leaflet, Tailwind, MongoDB</div>
      <div><strong>Coverage:</strong> All 38 Districts of Tamil Nadu</div>
      <div><strong>Date:</strong> October 2026</div>
    </div>
  </div>

  <!-- Section 1: Executive Summary -->
  <h1>1. Executive Summary & Purpose</h1>
  <p>
    <strong>EcoVision</strong> is an intelligent environmental resource recovery and route optimization platform tailored for the state of <strong>Tamil Nadu</strong>. The platform bridges the gap between waste generators (citizens, residential apartments, IT corridors, and MSME industries) and authorized waste recovery facilities certified by the <strong>Tamil Nadu Pollution Control Board (TNPCB)</strong>.
  </p>
  <p>
    By combining precision geospatial navigation (OpenStreetMap, Leaflet, and Haversine proximity formulas), real-time scrap market valuations, carbon offset analytics, and automated doorstep pickup dispatching, EcoVision incentivizes circular economy practices and diverts recyclable materials from local landfills.
  </p>

  <div class="grid-3">
    <div class="card">
      <div class="card-title">📍 Precision GPS Routing</div>
      <p style="font-size: 8.5pt; margin: 0;">Pinpoint detection, draggable origin markers, and instant turn-by-turn routing via Google Maps.</p>
    </div>
    <div class="card">
      <div class="card-title">💰 Scrap Monetization</div>
      <p style="font-size: 8.5pt; margin: 0;">Real-time pricing for plastics, e-waste, metals, paper, and textiles with instant UPI/Cash estimates.</p>
    </div>
    <div class="card">
      <div class="card-title">🌿 Carbon Accounting</div>
      <p style="font-size: 8.5pt; margin: 0;">Scientific calculation of metric CO₂ emissions saved and equivalent trees planted per booking.</p>
    </div>
  </div>

  <!-- Section 2: Technical Architecture -->
  <h1>2. Complete Technology Stack</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Layer</th>
        <th style="width: 28%;">Technologies</th>
        <th style="width: 50%;">Role & Architecture Benefit</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend Core</strong></td>
        <td>React 18.3, Vite 6.1, ES Modules</td>
        <td>Ultra-fast hot module replacement, optimized production bundles, modular component architecture.</td>
      </tr>
      <tr>
        <td><strong>Styling & UI</strong></td>
        <td>Tailwind CSS 3.4, Material-UI 6.4</td>
        <td>Glassmorphism dark/light design system, accessible dialogs, alerts, and smooth transitions.</td>
      </tr>
      <tr>
        <td><strong>Mapping & GIS</strong></td>
        <td>Leaflet 1.9, React-Leaflet 4.2</td>
        <td>Custom interactive map, draggable user origin pin, dynamic navigation polylines, uncertainty radius.</td>
      </tr>
      <tr>
        <td><strong>Geocoding</strong></td>
        <td>OpenStreetMap Nominatim API</td>
        <td>Reverse geocoding (lat/long to street address) and Tamil Nadu locality/pincode search autocomplete.</td>
      </tr>
      <tr>
        <td><strong>Backend API</strong></td>
        <td>Fastify 5.x, Node.js v24</td>
        <td>High-throughput Node.js microframework (up to 30,000 req/sec), JSON schema validation, CORS.</td>
      </tr>
      <tr>
        <td><strong>Data Layer</strong></td>
        <td>Mongoose 8, MongoDB + Memory Fallback</td>
        <td>Primary persistent storage in MongoDB with auto-switching in-memory seed store for resilient uptime.</td>
      </tr>
    </tbody>
  </table>

  <!-- Page Break -->
  <div class="page-break"></div>

  <!-- Section 3: High-Level Architecture Diagram -->
  <h1>3. System Architecture & Component Hierarchy</h1>
  <div class="card" style="background: #0f172a; color: #f8fafc; padding: 14px;">
    <pre style="background: transparent; color: #38bdf8; margin: 0; font-size: 7.5pt; line-height: 1.35;">
+---------------------------------------------------------------------------------------------------+
|                                      CLIENT APPLICATION (REACT)                                    |
+---------------------------------------------------------------------------------------------------+
  |                                                                                                 |
  +---> Navbar.jsx [z-1200]  ======> Sticky App Bar, Theme Toggle, GPS Locator, My Pickups Counter   |
  |                                                                                                 |
  +---> App.jsx              ======> Central State (userLocation, collectors, wasteType, bookings)   |
  |       |                                                                                         |
  |       +---> WasteTypeFilter.jsx       ===> 8 Material Categories Filter Buttons                 |
  |       +---> QuickDistrictSelector.jsx ===> 13 Major Tamil Nadu District Shortcut Chips           |
  |       +---> EcoStatsBanner.jsx        ===> Dynamic State-wide Environmental Metrics             |
  |       |                                                                                         |
  |       +---> TamilNaduMap.jsx [isolate]===> Leaflet Map, Draggable Pin, Uncertainty Circle       |
  |       |       +---> LocationSearchBar ===> Debounced Nominatim Street & Pincode Autocomplete     |
  |       |                                                                                         |
  |       +---> CollectorList.jsx         ===> Ranked Nearest Hubs Cards & Search Filter            |
  |       +---> NavigationRoutePanel.jsx  ===> Active Dynamic Route, Duration, Google Maps Launcher  |
  |                                                                                                 |
  +---> Modal Dialogs [z-1300]                                                                      |
          +---> BookingModal.jsx          ===> Scheduling Engine, Carbon & Cash Calculator, Pass    |
          +---> CollectorDetailModal.jsx  ===> TNPCB Certificate, Accepted Waste, Depot Capacity    |
          +---> BookingsListModal.jsx     ===> Citizen Booking History & Pass Status Tracker        |
          +---> RecyclingTipsModal.jsx    ===> Material Segregation Guidelines & Best Practices     |
+---------------------------------------------------------------------------------------------------+
                                            | (REST HTTP /api)
                                            v
+---------------------------------------------------------------------------------------------------+
|                                     FASTIFY BACKEND SERVER                                        |
+---------------------------------------------------------------------------------------------------+
  |
  +---> GET  /api/health            ===> Server, memory, and database status check
  +---> GET  /api/collectors        ===> Haversine distance ranking by user coords, category & dist
  +---> POST /api/collectors/nearest===> Computes nearest hubs with routing travel metrics
  +---> GET  /api/categories        ===> Master waste types, base rates (Rs/kg), and CO2 factors
  +---> GET  /api/districts         ===> Registered collector distributions across Tamil Nadu
  +---> POST /api/bookings          ===> Validates pickup, computes rewards, issues ECO-TN-XXXXXX
  +---> GET  /api/bookings          ===> History of user bookings
  +---> GET  /api/stats             ===> Regional recycling aggregates (kg diverted, trees, tons)
  |
  +---> Persistence Layer: MongoDB (Mongoose) <== Fallback ==> In-Memory Authentic TN Store
+---------------------------------------------------------------------------------------------------+
    </pre>
  </div>

  <!-- Section 4: End-to-End Workflows -->
  <h1>4. Detailed End-to-End Workflows</h1>

  <h2>Workflow 1: User Geolocation & Precision Origin Pinpointing</h2>
  <div class="workflow-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <div class="step-title">GPS Detection with High Accuracy & Cache Busting</div>
      <p style="font-size: 8.5pt;">The citizen clicks "Use My GPS". <code>App.jsx</code> invokes <code>navigator.geolocation.getCurrentPosition</code> with <code>enableHighAccuracy: true</code> and <code>maximumAge: 0</code>. Captures the device's coordinates and accuracy radius in meters.</p>
    </div>
  </div>

  <div class="workflow-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <div class="step-title">Automatic Reverse Geocoding via Nominatim</div>
      <p style="font-size: 8.5pt;">Coordinates are dispatched to <code>geocoding.js</code>. Nominatim API resolves the coordinates into human-readable localities (e.g. <em>"Anna Nagar East, Chennai"</em> or <em>"Gandhipuram, Coimbatore"</em>) with memory caching.</p>
    </div>
  </div>

  <div class="workflow-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <div class="step-title">Fine-Tuning: Draggable Pin & Address Search</div>
      <p style="font-size: 8.5pt;">Because Windows PCs/laptops lack satellite GPS hardware and estimate location via ISP IP, users can drag the green origin pin directly to their house. Alternatively, <code>LocationSearchBar.jsx</code> allows instant typing of any Tamil Nadu street or 6-digit pincode.</p>
    </div>
  </div>

  <h2>Workflow 2: Category Filtering & Haversine Distance Engine</h2>
  <div class="workflow-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <div class="step-title">Waste Category Selection</div>
      <p style="font-size: 8.5pt;">User selects a category (e.g., E-Waste, Plastics, Metals). <code>loadCollectors()</code> triggers with parameters <code>{ wasteType, lat, lng, district }</code>.</p>
    </div>
  </div>

  <div class="workflow-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <div class="step-title">Mathematical Distance Calculation (Haversine Formula)</div>
      <p style="font-size: 8.5pt;">In <code>collectorRoutes.js</code>, distance in km is calculated between user coordinates and each registered hub:
      <br><code>distance = 2 * 6371 * atan2(sqrt(a), sqrt(1 - a))</code>
      <br>City drive duration is calculated at an average urban speed of 35 km/h: <code>durationMin = max(5, round((distanceKm / 35) * 60))</code>.</p>
    </div>
  </div>

  <!-- Page Break -->
  <div class="page-break"></div>

  <h2>Workflow 3: Dynamic Mapping & Turn-by-Turn Navigation</h2>
  <div class="workflow-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <div class="step-title">Color-Coded Marker Mapping</div>
      <p style="font-size: 8.5pt;">Collectors display with distinct color-coded SVG pins according to category (Cyan for Plastics, Purple for E-waste, Amber for Metals, Blue for Paper, Emerald for Organic). Distance badges float on each pin.</p>
    </div>
  </div>

  <div class="workflow-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <div class="step-title">Active Route Polyline & Guidance Panel</div>
      <p style="font-size: 8.5pt;">Selecting a collector draws an animated dashed route line on the map. <code>NavigationRoutePanel.jsx</code> activates, showing distance in km, drive time, and an <strong>"Open in Google Maps GPS"</strong> button launching turn-by-turn driving directions.</p>
    </div>
  </div>

  <h2>Workflow 4: The Citizen Booking & Monetization Pipeline</h2>
  <div class="workflow-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <div class="step-title">Pickup Mode Selection & Address Autofill</div>
      <p style="font-size: 8.5pt;">User chooses between <strong>Self Drop-off</strong> or <strong>Doorstep Pickup</strong>. For doorstep pickup, a 1-click button (<em>"Use Map Pin"</em>) autofills their reverse-geocoded address directly into the form.</p>
    </div>
  </div>

  <div class="workflow-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <div class="step-title">Live Payout & Environmental Carbon Valuation</div>
      <p style="font-size: 8.5pt;">As the user selects or types estimated weight (5kg, 10kg, 25kg, 50kg, 100kg), the UI dynamically computes:
      <br><strong>Estimated Citizen Payout:</strong> <code>Weight (kg) × Material Market Rate (₹/kg)</code>
      <br><strong>Carbon Offset:</strong> <code>Weight (kg) × Material CO₂ Emission Factor (kg CO₂)</code></p>
    </div>
  </div>

  <div class="workflow-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <div class="step-title">Order Dispatch & Eco-Pass Generation</div>
      <p style="font-size: 8.5pt;">Submitting the form issues a <code>POST /api/bookings</code> request. Fastify generates a certified pass (<code>ECO-TN-XXXXXX</code>), persists the record, and the UI triggers a confetti celebration with the confirmed pass.</p>
    </div>
  </div>

  <!-- Section 5: Waste Categories & Scrap Rates Matrix -->
  <h1>5. Waste Material Categories & Valuation Matrix</h1>
  <table>
    <thead>
      <tr>
        <th>Waste Stream</th>
        <th>Accepted Subtypes</th>
        <th>Avg. Payout Rate</th>
        <th>Carbon Offset</th>
        <th>Environmental Impact</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Plastics & Polymers</strong></td>
        <td>PET bottles, HDPE containers, LDPE film, PP sacks</td>
        <td>₹20 / kg</td>
        <td>1.8 kg CO₂ / kg</td>
        <td>Recycled into polyester fiber, pellets, and recycled resin.</td>
      </tr>
      <tr>
        <td><strong>E-Waste & Electronics</strong></td>
        <td>Smartphones, motherboards, PCBs, laptop batteries, chargers</td>
        <td>₹60 / kg</td>
        <td>14.5 kg CO₂ / kg</td>
        <td>Precious metal recovery (Gold, Copper, Palladium); toxic lead diversion.</td>
      </tr>
      <tr>
        <td><strong>Metals & Scrap Alloys</strong></td>
        <td>Aluminum cans, copper wiring, brass fittings, iron scrap</td>
        <td>₹40 / kg</td>
        <td>4.2 kg CO₂ / kg</td>
        <td>Smelted into structural rebar, engine castings, and ingots.</td>
      </tr>
      <tr>
        <td><strong>Paper & Cardboard</strong></td>
        <td>Corrugated carton boxes, office A4, newspaper sheaves</td>
        <td>₹15 / kg</td>
        <td>1.2 kg CO₂ / kg</td>
        <td>Repulped into packaging liners, tissue, and paperboard.</td>
      </tr>
      <tr>
        <td><strong>Textiles & Garment Offcuts</strong></td>
        <td>Tiruppur knitwear cuttings, denim, discarded cotton shirts</td>
        <td>₹24 / kg</td>
        <td>3.5 kg CO₂ / kg</td>
        <td>Shredded into shoddy yarn, thermal insulation, and wiping rags.</td>
      </tr>
      <tr>
        <td><strong>Glass & Cullet</strong></td>
        <td>Beverage bottles, glass jars, broken architectural panes</td>
        <td>₹8 / kg</td>
        <td>0.8 kg CO₂ / kg</td>
        <td>Crushed into furnace cullet, reducing kiln temperatures by 30%.</td>
      </tr>
      <tr>
        <td><strong>Organic & Bio-waste</strong></td>
        <td>Household kitchen wet waste, hotel leftover food, horticultural green</td>
        <td>₹5 / kg</td>
        <td>0.9 kg CO₂ / kg</td>
        <td>Converted into bio-methane gas and nutrient-rich agricultural compost.</td>
      </tr>
      <tr>
        <td><strong>Hazardous & Biomedical</strong></td>
        <td>Used motor oil, lead-acid batteries, discarded clinical kits</td>
        <td>Free Safe Disposal</td>
        <td>8.0 kg CO₂ / kg</td>
        <td>Authorized high-temperature incineration and chemical stabilization.</td>
      </tr>
    </tbody>
  </table>

  <!-- Page Break -->
  <div class="page-break"></div>

  <!-- Section 6: REST API Specification -->
  <h1>6. Complete REST API Specifications</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Method</th>
        <th style="width: 25%;">Endpoint</th>
        <th style="width: 25%;">Query / Body Params</th>
        <th style="width: 35%;">Response Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/health</code></td>
        <td>None</td>
        <td>Returns server uptime, database mode, and timestamp.</td>
      </tr>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/collectors</code></td>
        <td><code>wasteType</code>, <code>district</code>, <code>lat</code>, <code>lng</code>, <code>search</code></td>
        <td>List of matching centers with computed distanceKm and durationMin.</td>
      </tr>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/collectors/:id</code></td>
        <td>URL Param <code>id</code></td>
        <td>Complete center profile: verified registration, materials, capacity, hours.</td>
      </tr>
      <tr>
        <td><span class="tag tag-amber">POST</span></td>
        <td><code>/api/collectors/nearest</code></td>
        <td><code>{ lat, lng, wasteType, maxDistanceKm }</code></td>
        <td>Top 5 closest centers strictly ranked by proximity coordinates.</td>
      </tr>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/districts</code></td>
        <td>None</td>
        <td>All 38 districts with registered facility counts and coordinates.</td>
      </tr>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/categories</code></td>
        <td>None</td>
        <td>All 8 waste streams, market rates per kg, and CO2 offset multipliers.</td>
      </tr>
      <tr>
        <td><span class="tag tag-amber">POST</span></td>
        <td><code>/api/bookings</code></td>
        <td><code>{ collectorId, type, wasteCategory, weight, name, phone, address, date }</code></td>
        <td>Creates booking, calculates payout & carbon, returns ECO-TN-XXXXXX pass.</td>
      </tr>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/bookings</code></td>
        <td>None</td>
        <td>Returns recent citizen collection and drop-off records.</td>
      </tr>
      <tr>
        <td><span class="tag tag-green">GET</span></td>
        <td><code>/api/stats</code></td>
        <td>None</td>
        <td>Aggregated state metrics: total kg recycled, CO2 saved, certified centers.</td>
      </tr>
    </tbody>
  </table>

  <!-- Section 7: Data Models -->
  <h1>7. Data Schema Architecture</h1>
  <div class="grid-2">
    <div class="card">
      <div class="card-title">Collector Schema (Mongoose)</div>
      <pre style="margin: 0; font-size: 7.2pt;">
{
  name: String,
  city: String,
  district: String,
  address: String,
  lat: Number,
  lng: Number,
  phone: String,
  acceptedWasteTypes: [{
    category: String,
    ratePerKg: Number
  }],
  operatingHours: String,
  capacityKgPerDay: Number,
  isVerified: Boolean,
  tnpcbRegNumber: String,
  rating: Number
}</pre>
    </div>

    <div class="card">
      <div class="card-title">Booking Schema (Mongoose)</div>
      <pre style="margin: 0; font-size: 7.2pt;">
{
  bookingId: String, // ECO-TN-XXXXXX
  collectorId: String,
  collectorName: String,
  type: String, // dropoff | doorstep_pickup
  wasteCategory: String,
  estimatedWeightKg: Number,
  userName: String,
  userPhone: String,
  userAddress: String,
  district: String,
  scheduledDate: String,
  timeSlot: String,
  estimatedReward: Number,
  co2SavedKg: Number,
  status: String // confirmed | completed
}</pre>
    </div>
  </div>

  <!-- Section 8: Setup & Installation -->
  <h1>8. Installation & Execution Guide</h1>
  <p>To run the entire EcoVision platform locally on your machine:</p>
  <pre style="font-size: 8pt;">
# 1. Install all dependencies across root, server, and client:
npm run install:all

# 2. Start both the Fastify Backend (Port 5000) and React Client (Port 3000):
npm run dev

# 3. Individual microservice commands:
npm run server  # Fastify API (http://localhost:5000)
npm run client  # Vite Frontend (http://localhost:3000)
  </pre>

  <div class="footer">
    EcoVision Tamil Nadu • Clean & Green Circular Resource Management • Certified Technical Documentation
  </div>

</body>
</html>`;

const tempHtmlPath = path.resolve('c:/Users/Akash/Documents/ecovision/temp_doc.html');
const outputPdfPath = path.resolve('c:/Users/Akash/Documents/ecovision/EcoVision_Project_Documentation_and_Workflow.pdf');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

console.log('Generating PDF via Microsoft Edge...');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const res = spawnSync(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdfPath}`,
  `file:///${tempHtmlPath.replace(/\\\\/g, '/')}`
]);

if (fs.existsSync(tempHtmlPath)) {
  fs.unlinkSync(tempHtmlPath);
}

if (fs.existsSync(outputPdfPath)) {
  const stats = fs.statSync(outputPdfPath);
  console.log(`SUCCESS! PDF generated: ${outputPdfPath} (${stats.size} bytes)`);
} else {
  console.error('Failed to generate PDF. Exit code:', res.status, res.stderr?.toString());
  process.exit(1);
}
