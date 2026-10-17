export const SEED_CATEGORIES = [
  {
    id: 'plastic',
    name: 'Plastics & Polymers',
    tamilName: 'பிளாஸ்டிக் கழிவுகள்',
    icon: 'Package',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    description: 'PET water bottles, HDPE detergent jugs, PP containers, hard plastics, and packaging wraps.',
    recyclingMethod: 'Shredded, pelletized into secondary resin for automotive, synthetic fleece, and pipes.',
    carbonOffsetPerKg: 1.8,
    avgMarketRatePerKg: 18,
    guidelines: [
      'Rinse food containers clean of residue before delivery',
      'Remove bottle caps and flatten bottles to save volume',
      'Separate flexible multi-layer plastic from rigid PET/HDPE'
    ],
    commonExamples: ['Water bottles', 'Milk pouches', 'Takeaway containers', 'Plastic buckets', 'Bubble wrap']
  },
  {
    id: 'organic',
    name: 'Organic & Wet Waste',
    tamilName: 'மக்கும் ஈரக் கழிவு',
    icon: 'Leaf',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    description: 'Food leftovers, vegetable peels, garden trimmings, agro-biomass, and floral temple waste.',
    recyclingMethod: 'Aerobic composting and anaerobic bio-methanation producing green biogas and bio-fertilizer.',
    carbonOffsetPerKg: 0.9,
    avgMarketRatePerKg: 4,
    guidelines: [
      'Do not mix with plastic wrappers or batteries',
      'Keep dry leaves separate from wet kitchen slops',
      'Drain excess liquid before drop-off'
    ],
    commonExamples: ['Fruit & vegetable peelings', 'Leftover meals', 'Garden yard clippings', 'Tea grounds']
  },
  {
    id: 'ewaste',
    name: 'E-Waste & Electronics',
    tamilName: 'மின்னணு கழிவு',
    icon: 'Cpu',
    color: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    description: 'Discarded smartphones, laptop batteries, printed circuit boards, cables, chargers, and LED screens.',
    recyclingMethod: 'Safe manual dismantling, pyrometallurgical recovery of gold/copper, and hazardous mercury isolation.',
    carbonOffsetPerKg: 14.5,
    avgMarketRatePerKg: 55,
    guidelines: [
      'Factory reset devices and remove SD cards before recycling',
      'Never puncture or crush swollen lithium-ion batteries',
      'Keep wires, adapters, and devices together'
    ],
    commonExamples: ['Dead smartphones', 'Laptops & monitors', 'Keyboards & cords', 'Inverter batteries', 'TV boards']
  },
  {
    id: 'metal',
    name: 'Metals & Scrap Alloys',
    tamilName: 'உலோக இரும்பு கழிவுகள்',
    icon: 'Shield',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    description: 'Aluminum soda cans, tin food cans, brass, copper wires, iron rebar, and automotive sheet metal.',
    recyclingMethod: 'High-temperature smelting into pure alloy ingots saving up to 95% of virgin ore energy.',
    carbonOffsetPerKg: 4.2,
    avgMarketRatePerKg: 35,
    guidelines: [
      'Wash beverage cans to avoid pest infestation',
      'Separate magnetic ferrous steel from aluminum/copper',
      'Bundle copper wire scraps securely'
    ],
    commonExamples: ['Beverage cans', 'Scrap iron pipes', 'Copper motor windings', 'Brass taps', 'Metal utensil scrap']
  },
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    tamilName: 'காகிதம் & அட்டை கழிவுகள்',
    icon: 'BookOpen',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    description: 'Corrugated delivery cartons, old newspapers, notebooks, office paper, and kraft packaging.',
    recyclingMethod: 'Hydropulping, de-inking, and pressing into 100% recycled paperboard and egg cartons.',
    carbonOffsetPerKg: 1.2,
    avgMarketRatePerKg: 14,
    guidelines: [
      'Keep dry! Wet or soiled cardboard cannot be repulped',
      'Remove heavy plastic shipping tape from shipping boxes',
      'Tie newspapers and notebooks into flat bundles'
    ],
    commonExamples: ['Amazon & courier cartons', 'Old newspapers', 'Office documents', 'Magazine bundles']
  },
  {
    id: 'glass',
    name: 'Glass & Cullet',
    tamilName: 'கண்ணாடி கழிவுகள்',
    icon: 'Wine',
    color: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    description: 'Clear and amber glass beverage bottles, cosmetic glass jars, and unbroken cullet containers.',
    recyclingMethod: 'Crushed into pure cullet and remelted infinitely with zero loss in structural quality.',
    carbonOffsetPerKg: 0.8,
    avgMarketRatePerKg: 8,
    guidelines: [
      'Rinse thoroughly and remove metal/plastic screw tops',
      'Do not mix with heat-resistant borosilicate (Pyrex) or mirrors',
      'Pack carefully in cardboard to prevent handling breakage'
    ],
    commonExamples: ['Flint glass bottles', 'Amber medicine bottles', 'Jam jars', 'Sauce glass containers']
  },
  {
    id: 'textile',
    name: 'Textiles & Fabric Waste',
    tamilName: 'துணி & ஆடை கழிவுகள்',
    icon: 'Shirt',
    color: '#14b8a6',
    badgeBg: 'rgba(20, 184, 166, 0.15)',
    description: 'Worn cotton garments, tailored fabric cutoffs, bed linens, and factory knitting spinning scraps.',
    recyclingMethod: 'Garnetted and spun into open-end recycled yarn, thermal insulation, and industrial cleaning wipes.',
    carbonOffsetPerKg: 3.5,
    avgMarketRatePerKg: 22,
    guidelines: [
      'Ensure clothing is clean, dry, and free of mildew',
      'Remove heavy metal buckles or plastic zippers if possible',
      'Sort by cotton vs polyester synthetics for higher value'
    ],
    commonExamples: ['Old cotton shirts & jeans', 'Tiruppur hosiery clippings', 'Worn bedsheets', 'Denim scraps']
  },
  {
    id: 'hazardous',
    name: 'Hazardous & Medical',
    tamilName: 'அபாயகரமான கழிவுகள்',
    icon: 'AlertOctagon',
    color: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    description: 'Pesticide bottles, chemical containers, mercury CFL bulbs, expired pharmaceuticals, and medical sharps.',
    recyclingMethod: 'High-temperature plasma incineration and secured hazardous landfill containment under TNPCB norms.',
    carbonOffsetPerKg: 2.1,
    avgMarketRatePerKg: 0,
    guidelines: [
      'Keep strictly in labeled, sealed puncture-proof containers',
      'Never dump in storm drains, sewage, or domestic trash bins',
      'Ensure proper handling PPE when packing'
    ],
    commonExamples: ['Expired tablets & syringes', 'CFL and fluorescent tubes', 'Pesticide cans', 'Paint thinners']
  }
];

export const SEED_COLLECTORS = [
  // --- CHENNAI ---
  {
    name: 'Guindy Eco-Recovery Industrial Hub',
    district: 'Chennai',
    city: 'Chennai',
    address: 'Plot 42, SIDCO Industrial Estate, Guindy, Chennai, Tamil Nadu 600032',
    lat: 13.0067,
    lng: 80.2012,
    phone: '+91 94441 23489',
    email: 'guindy.ecohub@tamilnadu-waste.org',
    tnpcbRegNo: 'TNPCB/CHN/IND/2023/0411',
    rating: 4.9,
    totalReviews: 128,
    operatingHours: '08:00 AM - 07:30 PM (Mon-Sat)',
    capacityLoad: 38,
    isVerified: true,
    description: 'Authorized TNPCB e-waste, polymer, and non-ferrous metal recycling collection facility in South Chennai.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 65, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 40, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Ambattur Material Recovery & Circularity Center',
    district: 'Chennai',
    city: 'Chennai',
    address: '3rd Main Rd, Ambattur Industrial Estate, Chennai, Tamil Nadu 600058',
    lat: 13.1143,
    lng: 80.1548,
    phone: '+91 98402 87612',
    email: 'ambattur.mrf@tnrecycles.gov.in',
    tnpcbRegNo: 'TNPCB/CHN/MRF/2022/8821',
    rating: 4.8,
    totalReviews: 94,
    operatingHours: '08:30 AM - 06:30 PM (All Days)',
    capacityLoad: 52,
    isVerified: true,
    description: 'North-West Chennai hub specializing in industrial grade plastics, metal turnings, and cardboard baling.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 38, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 16, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 9, acceptsDropoff: true, acceptsPickup: false }
    ]
  },
  {
    name: 'Perungudi Green Earth Recycling Park',
    district: 'Chennai',
    city: 'Chennai',
    address: 'Near 200 Feet Radial Rd, Perungudi, Chennai, Tamil Nadu 600096',
    lat: 12.9698,
    lng: 80.2374,
    phone: '+91 97910 44321',
    email: 'perungudi.green@ecovision.org',
    tnpcbRegNo: 'TNPCB/CHN/BIO/2024/1042',
    rating: 4.7,
    totalReviews: 87,
    operatingHours: '07:30 AM - 07:00 PM (Daily)',
    capacityLoad: 41,
    isVerified: true,
    description: 'OMR corridor hub accepting residential segregated dry waste, compostable food scraps, and electronic scrap.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 55, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 8, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Kodungaiyur Municipal Bio-Clean Center',
    district: 'Chennai',
    city: 'Chennai',
    address: 'T.H. Road, Kodungaiyur, North Chennai, Tamil Nadu 600118',
    lat: 13.1415,
    lng: 80.2625,
    phone: '+91 94445 67890',
    email: 'kodungaiyur.clean@chennaicorporation.gov.in',
    tnpcbRegNo: 'TNPCB/CHN/MUN/2021/3342',
    rating: 4.6,
    totalReviews: 76,
    operatingHours: '07:00 AM - 06:00 PM (Daily)',
    capacityLoad: 68,
    isVerified: true,
    description: 'North Chennai centralized processing facility for organic biomethanation and heavy plastic recycling.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 4, acceptsDropoff: true, acceptsPickup: false },
      { category: 'plastic', ratePerKg: 17, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 13, acceptsDropoff: true, acceptsPickup: true },
      { category: 'hazardous', ratePerKg: 0, acceptsDropoff: true, acceptsPickup: false }
    ]
  },

  // --- COIMBATORE ---
  {
    name: 'Peelamedu Tech Recyclers & E-Waste Hub',
    district: 'Coimbatore',
    city: 'Coimbatore',
    address: 'Avinashi Rd, Near PSG Tech, Peelamedu, Coimbatore, Tamil Nadu 641004',
    lat: 11.0284,
    lng: 77.0125,
    phone: '+91 98940 12894',
    email: 'peelamedu.tech@coimbatore-eco.com',
    tnpcbRegNo: 'TNPCB/CBE/EW/2023/5021',
    rating: 4.9,
    totalReviews: 142,
    operatingHours: '09:00 AM - 08:00 PM (Mon-Sat)',
    capacityLoad: 33,
    isVerified: true,
    description: 'Coimbatore premier certified electronic waste dismantling and precious metal extraction center.',
    acceptedWasteTypes: [
      { category: 'ewaste', ratePerKg: 70, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 42, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Kurichi SIDCO Clean Energy & Plastics Facility',
    district: 'Coimbatore',
    city: 'Coimbatore',
    address: 'Phase II, Kurichi SIDCO Industrial Area, Coimbatore, Tamil Nadu 641021',
    lat: 10.9416,
    lng: 76.9692,
    phone: '+91 94432 99811',
    email: 'kurichi.sidco@tnpcb-partner.org',
    tnpcbRegNo: 'TNPCB/CBE/IND/2022/1908',
    rating: 4.8,
    totalReviews: 105,
    operatingHours: '08:00 AM - 07:00 PM (Mon-Sat)',
    capacityLoad: 46,
    isVerified: true,
    description: 'Industrial scrap collection specializing in foundry sand, steel offcuts, and heavy HDPE plastics.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 45, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
      { category: 'textile', ratePerKg: 22, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Gandhipuram Bio-Compost & Civic MRF',
    district: 'Coimbatore',
    city: 'Coimbatore',
    address: 'Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    lat: 11.0168,
    lng: 76.9674,
    phone: '+91 98422 66543',
    email: 'gandhipuram.mrf@cbecity.gov.in',
    tnpcbRegNo: 'TNPCB/CBE/MUN/2024/0912',
    rating: 4.7,
    totalReviews: 89,
    operatingHours: '07:00 AM - 07:00 PM (Daily)',
    capacityLoad: 58,
    isVerified: true,
    description: 'Centrally located city center drop-off depot for organic food leftovers, bottles, and cardboard.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 14, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 9, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 17, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- MADURAI ---
  {
    name: 'Mattuthavani Central Resource Recovery Hub',
    district: 'Madurai',
    city: 'Madurai',
    address: 'Near Integrated Bus Terminus, Mattuthavani, Madurai, Tamil Nadu 625007',
    lat: 9.9482,
    lng: 78.1566,
    phone: '+91 94431 87234',
    email: 'mattuthavani.recovery@maduraicorp.tn.gov.in',
    tnpcbRegNo: 'TNPCB/MDU/REG/2023/4412',
    rating: 4.8,
    totalReviews: 119,
    operatingHours: '07:30 AM - 07:30 PM (Daily)',
    capacityLoad: 44,
    isVerified: true,
    description: 'Madurai major multimodal recovery hub managing segregated plastics, packaging, and commercial waste.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 14, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 36, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 52, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Kappalur SIDCO Metal & Polymers Depot',
    district: 'Madurai',
    city: 'Madurai',
    address: 'Sector 4, Kappalur Industrial Estate, Madurai, Tamil Nadu 625008',
    lat: 9.8517,
    lng: 78.0583,
    phone: '+91 98430 77123',
    email: 'kappalur.sidco@madurairecycling.in',
    tnpcbRegNo: 'TNPCB/MDU/IND/2022/6721',
    rating: 4.7,
    totalReviews: 67,
    operatingHours: '08:30 AM - 06:30 PM (Mon-Sat)',
    capacityLoad: 39,
    isVerified: true,
    description: 'Industrial grade recycling facility handling heavy vehicle scrap, industrial drum plastics, and tires.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 42, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'hazardous', ratePerKg: 0, acceptsDropoff: true, acceptsPickup: false }
    ]
  },

  // --- TIRUCHIRAPPALLI (TRICHY) ---
  {
    name: 'Ariyamangalam Green Material Recovery Facility',
    district: 'Tiruchirappalli',
    city: 'Trichy',
    address: 'Tanjore Main Road, Ariyamangalam, Trichy, Tamil Nadu 620010',
    lat: 10.8035,
    lng: 78.7185,
    phone: '+91 94433 11290',
    email: 'ariyamangalam.mrf@trichycorp.gov.in',
    tnpcbRegNo: 'TNPCB/TRY/MUN/2023/1209',
    rating: 4.8,
    totalReviews: 83,
    operatingHours: '08:00 AM - 07:00 PM (Daily)',
    capacityLoad: 47,
    isVerified: true,
    description: 'Remediated eco-park processing residential segregation, PET bottles, organic wet composting, and glass.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 4, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 14, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 8, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Thuvakudi Heavy Industrial Recyclers',
    district: 'Tiruchirappalli',
    city: 'Trichy',
    address: 'Near BHEL Township, Thuvakudi SIDCO, Trichy, Tamil Nadu 620015',
    lat: 10.7554,
    lng: 78.7997,
    phone: '+91 97900 88214',
    email: 'thuvakudi.bhel@trichyindustries.org',
    tnpcbRegNo: 'TNPCB/TRY/IND/2022/9831',
    rating: 4.9,
    totalReviews: 95,
    operatingHours: '09:00 AM - 06:30 PM (Mon-Sat)',
    capacityLoad: 31,
    isVerified: true,
    description: 'Heavy fabrication alloy recovery, electric cable granulation, and transformer e-waste processing.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 46, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 62, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- SALEM ---
  {
    name: 'Shevapet Scrap & Circularity Guild',
    district: 'Salem',
    city: 'Salem',
    address: 'Market Street, Shevapet, Salem, Tamil Nadu 636002',
    lat: 11.6492,
    lng: 78.1408,
    phone: '+91 94421 77654',
    email: 'shevapet.scrap@salem-recycle.in',
    tnpcbRegNo: 'TNPCB/SLM/TRADE/2023/3419',
    rating: 4.7,
    totalReviews: 110,
    operatingHours: '08:00 AM - 08:00 PM (Mon-Sat)',
    capacityLoad: 55,
    isVerified: true,
    description: 'Historic recycling trading hub specializing in aluminum, iron, brass vessels, and paper baling.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 44, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 50, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Jagir Ammapalayam Clean Eco Station',
    district: 'Salem',
    city: 'Salem',
    address: 'Near Omalur Main Rd, Jagir Ammapalayam, Salem, Tamil Nadu 636302',
    lat: 11.6743,
    lng: 78.1251,
    phone: '+91 98427 33419',
    email: 'ammapalayam@salemcorp.gov.in',
    tnpcbRegNo: 'TNPCB/SLM/MUN/2024/7710',
    rating: 4.8,
    totalReviews: 62,
    operatingHours: '07:30 AM - 06:30 PM (Daily)',
    capacityLoad: 35,
    isVerified: true,
    description: 'Urban municipal segregated station accepting bio-waste, plastic bottles, and glass jars.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 4.5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 17.5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 8.5, acceptsDropoff: true, acceptsPickup: false }
    ]
  },

  // --- TIRUNELVELI ---
  {
    name: 'Thachanallur Bio-Park & Recyclers',
    district: 'Tirunelveli',
    city: 'Tirunelveli',
    address: 'Madurai Road, Thachanallur, Tirunelveli, Tamil Nadu 627358',
    lat: 8.7495,
    lng: 77.7289,
    phone: '+91 94434 55678',
    email: 'thachanallur@nellai-green.org',
    tnpcbRegNo: 'TNPCB/TNV/BIO/2023/1820',
    rating: 4.8,
    totalReviews: 73,
    operatingHours: '08:00 AM - 07:00 PM (Daily)',
    capacityLoad: 36,
    isVerified: true,
    description: 'South Tamil Nadu flagship bio-composting and plastic recovery center on the banks of Thamirabarani.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 4, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 13, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 48, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  {
    name: 'Palayamkottai Civic Segregation Center',
    district: 'Tirunelveli',
    city: 'Tirunelveli',
    address: 'Trivandrum High Rd, Palayamkottai, Tirunelveli, Tamil Nadu 627002',
    lat: 8.7139,
    lng: 77.7470,
    phone: '+91 98421 99014',
    email: 'palayamkottai.eco@nellai.gov.in',
    tnpcbRegNo: 'TNPCB/TNV/MUN/2022/4119',
    rating: 4.7,
    totalReviews: 54,
    operatingHours: '08:30 AM - 06:30 PM (Mon-Sat)',
    capacityLoad: 42,
    isVerified: true,
    description: 'Convenient center for academic books, paper archives, glass containers, and domestic dry waste.',
    acceptedWasteTypes: [
      { category: 'paper', ratePerKg: 14, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 17, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 8, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- TIRUPPUR ---
  {
    name: 'Tiruppur Circular Textile & Yarn Recovery Unit',
    district: 'Tiruppur',
    city: 'Tiruppur',
    address: 'Veerapandi Industrial Estate, Palladam Rd, Tiruppur, Tamil Nadu 641605',
    lat: 11.0664,
    lng: 77.3411,
    phone: '+91 98432 11987',
    email: 'textilerecovery@tiruppur-knit.org',
    tnpcbRegNo: 'TNPCB/TPR/TEX/2023/8891',
    rating: 4.9,
    totalReviews: 138,
    operatingHours: '08:00 AM - 08:00 PM (Mon-Sat)',
    capacityLoad: 58,
    isVerified: true,
    description: 'Premier hosiery waste & fabric offcut recycling converting cotton fibers into OE yarn and insulation.',
    acceptedWasteTypes: [
      { category: 'textile', ratePerKg: 28, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- VELLORE ---
  {
    name: 'Ranipet & Katpadi Industrial Waste Consortium',
    district: 'Vellore',
    city: 'Vellore',
    address: 'Near Katpadi Junction, Ranipet Road, Vellore, Tamil Nadu 632007',
    lat: 12.9734,
    lng: 79.1325,
    phone: '+91 94435 66782',
    email: 'vellore.consortium@tnpcb-ranipet.org',
    tnpcbRegNo: 'TNPCB/VEL/IND/2023/5541',
    rating: 4.7,
    totalReviews: 82,
    operatingHours: '08:30 AM - 06:30 PM (Mon-Sat)',
    capacityLoad: 49,
    isVerified: true,
    description: 'Industrial estate facility specializing in safe chemical container neutralizing, metals, and e-waste.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 40, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 58, acceptsDropoff: true, acceptsPickup: true },
      { category: 'hazardous', ratePerKg: 0, acceptsDropoff: true, acceptsPickup: false },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- ERODE ---
  {
    name: 'Perundurai SIPCOT Green Technology Center',
    district: 'Erode',
    city: 'Erode',
    address: 'SIPCOT Industrial Growth Estate, Perundurai, Erode, Tamil Nadu 638052',
    lat: 11.2789,
    lng: 77.5847,
    phone: '+91 98425 44102',
    email: 'perundurai.sipcot@erode-eco.gov.in',
    tnpcbRegNo: 'TNPCB/ERD/SIP/2023/3109',
    rating: 4.8,
    totalReviews: 78,
    operatingHours: '08:00 AM - 07:00 PM (Mon-Sat)',
    capacityLoad: 43,
    isVerified: true,
    description: 'Comprehensive industrial ecology hub accepting textile clippings, heavy polymers, and bio-waste.',
    acceptedWasteTypes: [
      { category: 'textile', ratePerKg: 24, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'organic', ratePerKg: 4.5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 39, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- THANJAVUR ---
  {
    name: 'Pillaiyarpatti Delta Agro & Material Recyclers',
    district: 'Thanjavur',
    city: 'Thanjavur',
    address: 'Trichy Main Rd, Pillaiyarpatti, Thanjavur, Tamil Nadu 613403',
    lat: 10.7684,
    lng: 79.1174,
    phone: '+91 94437 22891',
    email: 'delta.recyclers@thanjavur.tn.gov.in',
    tnpcbRegNo: 'TNPCB/TNJ/AGR/2024/1105',
    rating: 4.8,
    totalReviews: 61,
    operatingHours: '08:00 AM - 06:30 PM (Daily)',
    capacityLoad: 37,
    isVerified: true,
    description: 'Cauvery delta agro-residue biomass processor and civic cardboard/plastic recovery hub.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 14, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 17, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- KANCHIPURAM ---
  {
    name: 'Sriperumbudur Hi-Tech Electronics Recyclers',
    district: 'Kanchipuram',
    city: 'Kanchipuram',
    address: 'SIPCOT Industrial Park, Sriperumbudur, Tamil Nadu 602105',
    lat: 12.9675,
    lng: 79.9431,
    phone: '+91 97909 33214',
    email: 'sriperumbudur.ewaste@greentech.org',
    tnpcbRegNo: 'TNPCB/KPM/EW/2023/7788',
    rating: 4.9,
    totalReviews: 124,
    operatingHours: '08:30 AM - 07:30 PM (Mon-Sat)',
    capacityLoad: 40,
    isVerified: true,
    description: 'Electronics manufacturing corridor hub for high-grade server scrap, printed circuit boards, and lead-acid batteries.',
    acceptedWasteTypes: [
      { category: 'ewaste', ratePerKg: 72, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 43, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true }
    ]
  },

  // --- DINDIGUL ---
  {
    name: 'Dindigul Nagal Nagar Clean Material Depot',
    district: 'Dindigul',
    city: 'Dindigul',
    address: 'Bypass Road, Nagal Nagar, Dindigul, Tamil Nadu 624003',
    lat: 10.3673,
    lng: 77.9803,
    phone: '+91 94429 88120',
    email: 'dindigul.depot@tn-clean.in',
    tnpcbRegNo: 'TNPCB/DGL/MUN/2023/2219',
    rating: 4.7,
    totalReviews: 59,
    operatingHours: '08:00 AM - 06:30 PM (Mon-Sat)',
    capacityLoad: 41,
    isVerified: true,
    description: 'Dindigul central collection center for metal scraps, lock industry offcuts, and plastic recycling.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 42, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 17.5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 13.5, acceptsDropoff: true, acceptsPickup: true }
    ]
  }
];
