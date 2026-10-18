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
    commonExamples: ['Old cotton shirts & jeans', 'Chennai garment clippings', 'Worn bedsheets', 'Denim scraps']
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
  // 1. Guindy
  {
    _id: 'mem_col_1',
    name: 'Guindy Eco-Recovery Industrial Hub',
    district: 'Guindy',
    zone: 'Guindy',
    city: 'Chennai',
    address: 'Plot 42, SIDCO Industrial Estate, Guindy, Chennai, Tamil Nadu 600032',
    lat: 13.0067,
    lng: 80.2012,
    phone: '+91 94441 23489',
    email: 'guindy.ecohub@chennairecycle.org',
    tnpcbRegNo: 'TNPCB/CHN/IND/2023/0411',
    rating: 4.9,
    totalReviews: 128,
    operatingHours: '08:00 AM - 07:30 PM (Mon-Sat)',
    capacityLoad: 38,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 8,
    serviceWards: ['Guindy', 'Saidapet', 'Alandur', 'Ekkatuthangal', 'Jafferkhanpet'],
    dealerUserId: 'usr_dealer_1',
    description: 'Premier South Chennai industrial hub authorized for e-waste, scrap alloys, and post-consumer polymer baling with automated weighbridge.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 65, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 40, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 2. Ambattur
  {
    _id: 'mem_col_2',
    name: 'Ambattur Material Recovery & Circularity Center',
    district: 'Ambattur',
    zone: 'Ambattur',
    city: 'Chennai',
    address: '3rd Main Rd, Ambattur Industrial Estate, Chennai, Tamil Nadu 600058',
    lat: 13.1143,
    lng: 80.1548,
    phone: '+91 98402 87612',
    email: 'ambattur.mrf@chennaicorporation.gov.in',
    tnpcbRegNo: 'TNPCB/CHN/MRF/2022/8821',
    rating: 4.8,
    totalReviews: 94,
    operatingHours: '08:30 AM - 06:30 PM (All Days)',
    capacityLoad: 52,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 10,
    serviceWards: ['Ambattur', 'Mogappair', 'Padi', 'Korattur', 'Avadi'],
    description: 'North-West Chennai hub specializing in industrial grade plastics, metal turnings, and corrugated baling.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 38, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 16, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 9, acceptsDropoff: true, acceptsPickup: false }
    ]
  },
  // 3. Adyar
  {
    _id: 'mem_col_3',
    name: 'Adyar & Besant Nagar Green Resource Hub',
    district: 'Adyar',
    zone: 'Adyar',
    city: 'Chennai',
    address: '4th Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020',
    lat: 13.0012,
    lng: 80.2565,
    phone: '+91 94443 19024',
    email: 'adyar.green@chennairecycle.org',
    tnpcbRegNo: 'TNPCB/CHN/ADY/2024/0912',
    rating: 4.9,
    totalReviews: 110,
    operatingHours: '07:30 AM - 07:00 PM (Daily)',
    capacityLoad: 34,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 7,
    serviceWards: ['Adyar', 'Besant Nagar', 'Thiruvanmiyur', 'Kotturpuram', 'R.A. Puram'],
    description: 'GCC Zone 13 Model Resource Recovery Facility handling household dry recyclables, e-waste, and coastal cleanup items.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 60, acceptsDropoff: true, acceptsPickup: true },
      { category: 'organic', ratePerKg: 5, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 4. Anna Nagar
  {
    _id: 'mem_col_4',
    name: 'Anna Nagar Smart Sorting & Baling Facility',
    district: 'Anna Nagar',
    zone: 'Anna Nagar',
    city: 'Chennai',
    address: '2nd Avenue, Near Roundtana, Anna Nagar West, Chennai, Tamil Nadu 600040',
    lat: 13.0850,
    lng: 80.2100,
    phone: '+91 98401 55432',
    email: 'annanagar.smart@ecovision.org',
    tnpcbRegNo: 'TNPCB/CHN/ANN/2023/1145',
    rating: 4.8,
    totalReviews: 86,
    operatingHours: '08:00 AM - 07:00 PM (Mon-Sat)',
    capacityLoad: 44,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 8,
    serviceWards: ['Anna Nagar', 'Kilpauk', 'Shenoy Nagar', 'Aminjikarai', 'Arumbakkam'],
    description: 'GCC Zone 8 flagship automated segregation unit accepting packaging cardboard, PET bottles, and consumer appliances.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 17, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 36, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 62, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 5. T. Nagar
  {
    _id: 'mem_col_5',
    name: 'T. Nagar Urban E-Waste & Paper Depot',
    district: 'T. Nagar',
    zone: 'T. Nagar',
    city: 'Chennai',
    address: 'Usman Road, Near Panagal Park, T. Nagar, Chennai, Tamil Nadu 600017',
    lat: 13.0418,
    lng: 80.2341,
    phone: '+91 94447 88901',
    email: 'tnagar.depot@chennairecycle.org',
    tnpcbRegNo: 'TNPCB/CHN/TNG/2022/4510',
    rating: 4.7,
    totalReviews: 104,
    operatingHours: '09:00 AM - 08:30 PM (Daily)',
    capacityLoad: 60,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 6,
    serviceWards: ['T. Nagar', 'Pondy Bazaar', 'Kodambakkam', 'Teynampet', 'Nungambakkam'],
    description: 'Commercial district depot in Central Chennai specialized in retail packaging, textile cutoffs, and electronic scrap.',
    acceptedWasteTypes: [
      { category: 'paper', ratePerKg: 16, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 70, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 39, acceptsDropoff: true, acceptsPickup: true },
      { category: 'textile', ratePerKg: 22, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 6. Perungudi / OMR
  {
    _id: 'mem_col_6',
    name: 'Perungudi - OMR Clean Resource Park',
    district: 'Perungudi / OMR',
    zone: 'Perungudi / OMR',
    city: 'Chennai',
    address: 'Near 200 Feet Radial Rd, Perungudi, Chennai, Tamil Nadu 600096',
    lat: 12.9698,
    lng: 80.2374,
    phone: '+91 97910 44321',
    email: 'perungudi.clean@ecovision.org',
    tnpcbRegNo: 'TNPCB/CHN/BIO/2024/1042',
    rating: 4.7,
    totalReviews: 87,
    operatingHours: '07:30 AM - 07:00 PM (Daily)',
    capacityLoad: 41,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 9,
    serviceWards: ['Perungudi', 'Thoraipakkam', 'Sholinganallur', 'Kandanchavadi', 'SRP Tools'],
    description: 'IT Corridor circular hub servicing high-rise gated communities and IT tech parks with door-to-door green recovery.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 55, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 8, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 7. Manali
  {
    _id: 'mem_col_7',
    name: 'Manali Industrial Secondary Polymer Hub',
    district: 'Manali',
    zone: 'Manali',
    city: 'Chennai',
    address: 'Manali Express Highway, North Chennai, Tamil Nadu 600068',
    lat: 13.1670,
    lng: 80.2600,
    phone: '+91 94445 67890',
    email: 'manali.polymers@chennaicorporation.gov.in',
    tnpcbRegNo: 'TNPCB/CHN/MNL/2021/3342',
    rating: 4.6,
    totalReviews: 76,
    operatingHours: '07:00 AM - 06:00 PM (Mon-Sat)',
    capacityLoad: 68,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 12,
    serviceWards: ['Manali', 'Madhavaram', 'Ennore', 'Tiruvottiyur', 'Kathivakkam'],
    description: 'Heavy industrial zone reprocessing hub equipped with high-capacity balers, granulators, and wash lines.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 21, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 42, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
      { category: 'hazardous', ratePerKg: 0, acceptsDropoff: true, acceptsPickup: false }
    ]
  },
  // 8. Mylapore
  {
    _id: 'mem_col_8',
    name: 'Mylapore Heritage Resource & Scrap Aggregator',
    district: 'Mylapore',
    zone: 'Mylapore',
    city: 'Chennai',
    address: 'Luz Church Road, Mylapore, Chennai, Tamil Nadu 600004',
    lat: 13.0368,
    lng: 80.2676,
    phone: '+91 98403 12908',
    email: 'mylapore.aggregator@chennairecycle.org',
    tnpcbRegNo: 'TNPCB/CHN/MYL/2023/5120',
    rating: 4.8,
    totalReviews: 72,
    operatingHours: '08:00 AM - 07:00 PM (Daily)',
    capacityLoad: 36,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 6,
    serviceWards: ['Mylapore', 'Mandaveli', 'Alwarpet', 'Royapettah', 'Santhome'],
    description: 'Historic cultural district recovery station collecting brass, copper utensils, paper bundles, and clean bottles.',
    acceptedWasteTypes: [
      { category: 'metal', ratePerKg: 42, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 16, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'glass', ratePerKg: 9, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 9. Porur
  {
    _id: 'mem_col_9',
    name: 'Porur - Vadapalani Circularity Center',
    district: 'Porur',
    zone: 'Porur',
    city: 'Chennai',
    address: 'Mount-Poonamallee High Road, Porur, Chennai, Tamil Nadu 600116',
    lat: 13.0382,
    lng: 80.1565,
    phone: '+91 97908 65432',
    email: 'porur.circular@ecovision.org',
    tnpcbRegNo: 'TNPCB/CHN/POR/2024/7741',
    rating: 4.8,
    totalReviews: 81,
    operatingHours: '08:00 AM - 07:00 PM (Mon-Sat)',
    capacityLoad: 42,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 8,
    serviceWards: ['Porur', 'Vadapalani', 'Valasaravakkam', 'Ramapuram', 'Kattupakkam'],
    description: 'South-West Chennai gateway aggregator serving commercial retail and residential complexes with mobile collection vans.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 37, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 58, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 10. Royapuram
  {
    _id: 'mem_col_10',
    name: 'Royapuram Port Marine Plastics & Scrap Works',
    district: 'Royapuram',
    zone: 'Royapuram',
    city: 'Chennai',
    address: 'SN Chetty Street, Near Port Gate 5, Royapuram, Chennai, Tamil Nadu 600013',
    lat: 13.1120,
    lng: 80.2950,
    phone: '+91 94440 33819',
    email: 'royapuram.marine@chennairecycle.org',
    tnpcbRegNo: 'TNPCB/CHN/ROY/2023/2099',
    rating: 4.7,
    totalReviews: 65,
    operatingHours: '07:30 AM - 06:30 PM (Mon-Sat)',
    capacityLoad: 50,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 7,
    serviceWards: ['Royapuram', 'George Town', 'Parrys', 'Kasimedu', 'Washermanpet'],
    description: 'Port-side recovery station specialized in discarded marine nylon nets, rigid maritime plastics, and heavy steel ropes.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 45, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 14, acceptsDropoff: true, acceptsPickup: true },
      { category: 'textile', ratePerKg: 20, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 11. Tambaram
  {
    _id: 'mem_col_11',
    name: 'Tambaram South Gateway MRF Station',
    district: 'Tambaram',
    zone: 'Tambaram',
    city: 'Chennai',
    address: 'GST Road, Near Sanatorium, Tambaram, Chennai, Tamil Nadu 600045',
    lat: 12.9249,
    lng: 80.1000,
    phone: '+91 98404 99182',
    email: 'tambaram.mrf@chennaicorporation.gov.in',
    tnpcbRegNo: 'TNPCB/CHN/TAM/2023/6410',
    rating: 4.8,
    totalReviews: 92,
    operatingHours: '08:00 AM - 07:00 PM (Daily)',
    capacityLoad: 45,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 12,
    serviceWards: ['Tambaram', 'Pallavaram', 'Chromepet', 'Sanatorium', 'Perungalathur'],
    description: 'South Chennai junction facility connecting suburban wards to certified recycling plants with automated weighbridge.',
    acceptedWasteTypes: [
      { category: 'plastic', ratePerKg: 18, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 36, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true },
      { category: 'organic', ratePerKg: 4, acceptsDropoff: true, acceptsPickup: true }
    ]
  },
  // 12. Velachery
  {
    _id: 'mem_col_12',
    name: 'Velachery Urban Biomethanation & Scrap Station',
    district: 'Velachery',
    zone: 'Velachery',
    city: 'Chennai',
    address: 'Taramani 100 Feet Road, Velachery, Chennai, Tamil Nadu 600042',
    lat: 12.9750,
    lng: 80.2210,
    phone: '+91 97911 55667',
    email: 'velachery.station@ecovision.org',
    tnpcbRegNo: 'TNPCB/CHN/VEL/2024/3011',
    rating: 4.9,
    totalReviews: 108,
    operatingHours: '07:30 AM - 07:30 PM (Daily)',
    capacityLoad: 40,
    isVerified: true,
    pointType: 'dealer',
    serviceRadiusKm: 7,
    serviceWards: ['Velachery', 'Madipakkam', 'Adambakkam', 'Taramani', 'Ullagaram'],
    description: 'GCC Zone 13 modern resource center featuring bio-gas generation from wet waste and high-speed dry recyclables sorting.',
    acceptedWasteTypes: [
      { category: 'organic', ratePerKg: 5, acceptsDropoff: true, acceptsPickup: true },
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 16, acceptsDropoff: true, acceptsPickup: true },
      { category: 'ewaste', ratePerKg: 60, acceptsDropoff: true, acceptsPickup: true }
    ]
  }
];

// Chennai Industrial Recycling Factories (Buyers)
export const SEED_FACTORIES = [
  {
    _id: 'fac_manali_1',
    factoryId: 'fac_manali_1',
    name: 'Manali Eco-Polymers Ltd',
    district: 'Manali',
    zone: 'Manali',
    city: 'Chennai',
    address: 'Expressway Petrochemical Complex, Manali, Chennai 600068',
    lat: 13.1670,
    lng: 80.2600,
    phone: '+91 98402 99887',
    email: 'procurement@manalieco.com',
    pointType: 'factory',
    primaryCategory: 'plastic',
    openDemands: 'PET & HDPE Flakes (5,000 kg @ ₹22/kg)',
    description: 'Specialized industrial recycling plant producing synthetic rPET resin and polyester fiber.',
    tnpcbRegNo: 'TNPCB/CHN/FAC/2022/9011'
  },
  {
    _id: 'fac_guindy_metal_1',
    factoryId: 'fac_guindy_metal_1',
    name: 'Guindy Precision Metallics & Alloys',
    district: 'Guindy',
    zone: 'Guindy',
    city: 'Chennai',
    address: 'Plot 18, SIDCO Industrial Estate, Guindy, Chennai 600032',
    lat: 13.0110,
    lng: 80.2080,
    phone: '+91 94441 88990',
    email: 'sourcing@guindymetals.in',
    pointType: 'factory',
    primaryCategory: 'metal',
    openDemands: 'Aluminum Cans & Copper Shred (3,000 kg @ ₹48/kg)',
    description: 'Foundry secondary smelting facility producing automotive aluminum ingots.',
    tnpcbRegNo: 'TNPCB/CHN/FAC/2021/4412'
  },
  {
    _id: 'fac_ambattur_paper_1',
    factoryId: 'fac_ambattur_paper_1',
    name: 'Ambattur Corrugated & Kraft Repulping Mills',
    district: 'Ambattur',
    zone: 'Ambattur',
    city: 'Chennai',
    address: 'Ambattur Industrial Estate 3rd Phase, Chennai 600058',
    lat: 13.1180,
    lng: 80.1600,
    phone: '+91 98403 66771',
    email: 'rawmaterials@ambatturkraft.com',
    pointType: 'factory',
    primaryCategory: 'paper',
    openDemands: 'OCC Grade 11 Kraft Cartons (8,000 kg @ ₹16.5/kg)',
    description: 'Continuous hydropulping paper mill utilizing 100% recovered corrugated cardboard.',
    tnpcbRegNo: 'TNPCB/CHN/FAC/2023/1820'
  },
  {
    _id: 'fac_sriperumbudur_ewaste_1',
    factoryId: 'fac_sriperumbudur_ewaste_1',
    name: 'Sriperumbudur High-Tech Electronic Recyclers',
    district: 'Sriperumbudur',
    zone: 'Sriperumbudur',
    city: 'Chennai',
    address: 'SIPCOT Industrial Park, Chennai West 602105',
    lat: 12.9675,
    lng: 79.9431,
    phone: '+91 97909 33214',
    email: 'ewaste@sriperumbudur-tech.in',
    pointType: 'factory',
    primaryCategory: 'ewaste',
    openDemands: 'PCB Boards & Copper Core Cables (2,000 kg @ ₹68/kg)',
    description: 'High-tech e-waste dismantling, precious metals extraction and refining complex.',
    tnpcbRegNo: 'TNPCB/CHN/FAC/2023/7788'
  },
  {
    _id: 'fac_ennore_glass_1',
    factoryId: 'fac_ennore_glass_1',
    name: 'Ennore Green Glass & Cullet Works',
    district: 'Ennore',
    zone: 'Ennore',
    city: 'Chennai',
    address: 'Ennore Express Highway, North Chennai 600057',
    lat: 13.2010,
    lng: 80.3150,
    phone: '+91 94444 11200',
    email: 'cullet@ennoreglass.org',
    pointType: 'factory',
    primaryCategory: 'glass',
    openDemands: 'Flint & Amber Container Cullet (10,000 kg @ ₹9/kg)',
    description: 'Automated glass remelting furnace producing bottles and vials with infinite recycling efficiency.',
    tnpcbRegNo: 'TNPCB/CHN/FAC/2024/0029'
  }
];

export const SEED_USERS = [
  {
    _id: 'usr_customer_1',
    name: 'Kavitha Ramachandran',
    email: 'customer@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'customer',
    phone: '+91 98401 23456',
    district: 'Anna Nagar',
    address: '14, 2nd Main Road, Anna Nagar, Chennai 600040'
  },
  {
    _id: 'usr_dealer_1',
    name: 'Rajesh Selvam (Guindy Eco-Recovery)',
    email: 'dealer@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'dealer',
    phone: '+91 94441 23489',
    district: 'Guindy',
    address: 'Plot 42, SIDCO Industrial Estate, Guindy, Chennai 600032',
    facilityName: 'Guindy Eco-Recovery Industrial Hub',
    facilityId: 'mem_col_1',
    serviceRadiusKm: 8,
    serviceWards: ['Guindy', 'Saidapet', 'Alandur', 'Ekkatuthangal', 'Jafferkhanpet'],
    lat: 13.0067,
    lng: 80.2012
  },
  {
    _id: 'usr_factory_1',
    name: 'Anand Kumar (Manali Eco-Polymers Ltd)',
    email: 'factory@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'factory',
    phone: '+91 98402 99887',
    district: 'Manali',
    address: 'Expressway Petrochemical Complex, Manali, Chennai 600068',
    facilityName: 'Manali Eco-Polymers Ltd',
    facilityId: 'fac_manali_1',
    lat: 13.1670,
    lng: 80.2600
  },
  {
    _id: 'usr_admin_1',
    name: 'Dr. S. Meenakshi (GCC City Environmental Officer)',
    email: 'admin@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'admin',
    phone: '+91 44 2538 4145',
    district: 'Chennai Central',
    address: 'Greater Chennai Corporation (GCC), Ripon Building, Chennai 600003',
    facilityName: 'Greater Chennai Corporation & TNPCB Joint Directorate'
  }
];

export const SEED_INVENTORY = [
  {
    _id: 'inv_1',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'plastic',
    availableKg: 2450,
    totalCollectedKg: 3200,
    totalDispatchedKg: 750,
    lastCollectedAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    _id: 'inv_2',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'metal',
    availableKg: 1850,
    totalCollectedKg: 2400,
    totalDispatchedKg: 550,
    lastCollectedAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: 'inv_3',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'paper',
    availableKg: 3100,
    totalCollectedKg: 4200,
    totalDispatchedKg: 1100,
    lastCollectedAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    _id: 'inv_4',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'ewaste',
    availableKg: 420,
    totalCollectedKg: 420,
    totalDispatchedKg: 0,
    lastCollectedAt: new Date(Date.now() - 3600000 * 24)
  },
  {
    _id: 'inv_5',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'textile',
    availableKg: 1600,
    totalCollectedKg: 2000,
    totalDispatchedKg: 400,
    lastCollectedAt: new Date(Date.now() - 3600000 * 8)
  }
];

export const SEED_REQUIREMENTS = [
  {
    _id: 'req_1',
    requirementId: 'REQ-CHN-101',
    factoryId: 'fac_manali_1',
    factoryName: 'Manali Eco-Polymers Ltd',
    category: 'plastic',
    grade: 'Clean PET / HDPE Flakes (>98% Purity)',
    quantityNeededKg: 5000,
    fulfilledKg: 1500,
    offeredPricePerKg: 22,
    district: 'Manali',
    deliveryAddress: 'Expressway Petrochemical Complex, Manali, Chennai 600068',
    deadline: '2026-11-15',
    status: 'open',
    notes: 'Urgent demand for recycled polyester filament manufacturing.'
  },
  {
    _id: 'req_2',
    requirementId: 'REQ-CHN-102',
    factoryId: 'fac_guindy_metal_1',
    factoryName: 'Guindy Precision Metallics & Alloys',
    category: 'metal',
    grade: 'Clean Aluminum Cans & Copper Wire Shred',
    quantityNeededKg: 3000,
    fulfilledKg: 800,
    offeredPricePerKg: 48,
    district: 'Guindy',
    deliveryAddress: 'SIDCO Industrial Estate, Guindy, Chennai 600032',
    deadline: '2026-11-30',
    status: 'open',
    notes: 'Secondary smelting for precision automotive castings.'
  },
  {
    _id: 'req_3',
    requirementId: 'REQ-CHN-103',
    factoryId: 'fac_ambattur_paper_1',
    factoryName: 'Ambattur Corrugated & Kraft Repulping',
    category: 'paper',
    grade: 'Old Corrugated Cartons (OCC Grade 11)',
    quantityNeededKg: 8000,
    fulfilledKg: 2500,
    offeredPricePerKg: 16.5,
    district: 'Ambattur',
    deliveryAddress: 'Ambattur Industrial Estate 3rd Phase, Chennai 600058',
    deadline: '2026-11-20',
    status: 'open',
    notes: 'Direct feed for industrial packaging paperboard mills.'
  },
  {
    _id: 'req_4',
    requirementId: 'REQ-CHN-104',
    factoryId: 'fac_sriperumbudur_ewaste_1',
    factoryName: 'Sriperumbudur Electronic Recyclers',
    category: 'ewaste',
    grade: 'Class-A Circuit Boards & Copper Cables',
    quantityNeededKg: 2000,
    fulfilledKg: 0,
    offeredPricePerKg: 68,
    district: 'Sriperumbudur',
    deliveryAddress: 'SIPCOT Industrial Park, Chennai West 602105',
    deadline: '2026-12-05',
    status: 'open',
    notes: 'Precious metal recovery for electronics supply chains.'
  }
];

export const SEED_PURCHASE_ORDERS = [
  {
    _id: 'po_1',
    poNumber: 'PO-CHN-8011',
    requirementId: 'REQ-CHN-101',
    factoryId: 'fac_manali_1',
    factoryName: 'Manali Eco-Polymers Ltd',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'plastic',
    quantityKg: 1500,
    unitPrice: 22,
    totalAmount: 33000,
    status: 'verified',
    vehicleNumber: 'TN 09 BX 4412 (10-Ton Eicher)',
    dispatchDate: '2026-10-15',
    verifiedWeightKg: 1485,
    qualityGrade: 'Grade A+ (99.1% Purity)',
    verificationNotes: 'Sample moisture < 1.2%, passed Chennai port spectrometer inspection.',
    verifiedAt: new Date(Date.now() - 3600000 * 48),
    paymentStatus: 'paid',
    paymentRef: 'NEFT-RBI-20261015-881920',
    paymentReleasedAt: new Date(Date.now() - 3600000 * 24),
    createdAt: new Date(Date.now() - 3600000 * 72)
  },
  {
    _id: 'po_2',
    poNumber: 'PO-CHN-8012',
    requirementId: 'REQ-CHN-102',
    factoryId: 'fac_guindy_metal_1',
    factoryName: 'Guindy Precision Metallics & Alloys',
    dealerId: 'mem_col_1',
    dealerName: 'Guindy Eco-Recovery Industrial Hub',
    category: 'metal',
    quantityKg: 800,
    unitPrice: 48,
    totalAmount: 38400,
    status: 'shipped',
    vehicleNumber: 'TN 22 Q 9122 (Mahindra Bolero Pickup)',
    dispatchDate: '2026-10-18',
    verifiedWeightKg: 0,
    qualityGrade: 'In Transit',
    verificationNotes: '',
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 3600000 * 6)
  }
];

export const SEED_AUDIT_LOGS = [
  {
    _id: 'log_1',
    action: 'SYSTEM_BOOT',
    category: 'ADMIN',
    actorId: 'usr_admin_1',
    actorName: 'Dr. S. Meenakshi',
    actorRole: 'admin',
    targetResource: 'EcoVision Chennai Core',
    targetId: 'SYS_INIT_CHN',
    details: 'EcoVision Chennai circular resource platform initialized for Greater Chennai Corporation (GCC) wards.',
    timestamp: new Date(Date.now() - 3600000 * 120)
  },
  {
    _id: 'log_2',
    action: 'REQUIREMENT_PUBLISHED',
    category: 'MARKETPLACE',
    actorId: 'usr_factory_1',
    actorName: 'Manali Eco-Polymers Ltd',
    actorRole: 'factory',
    targetResource: 'MaterialRequirement',
    targetId: 'REQ-CHN-101',
    details: 'Published demand for 5,000 kg HDPE/PET plastic flakes at ₹22/kg in Manali Industrial Belt.',
    timestamp: new Date(Date.now() - 3600000 * 96)
  },
  {
    _id: 'log_3',
    action: 'PURCHASE_ORDER_VERIFIED',
    category: 'PAYMENT',
    actorId: 'usr_factory_1',
    actorName: 'Manali Eco-Polymers Ltd',
    actorRole: 'factory',
    targetResource: 'PurchaseOrder',
    targetId: 'PO-CHN-8011',
    details: 'Verified 1,485 kg plastic shipment from Guindy Eco-Recovery Hub. Disbursed ₹32,670 payment.',
    timestamp: new Date(Date.now() - 3600000 * 24)
  }
];
