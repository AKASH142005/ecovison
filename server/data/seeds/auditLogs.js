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
