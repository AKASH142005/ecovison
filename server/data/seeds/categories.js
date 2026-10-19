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
