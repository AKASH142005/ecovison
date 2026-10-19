import { Collector } from '../models/Collector.js';
import { isDbLive, memoryStore, logAudit } from '../config/db.js';
import { calculateDistance, estimateDriveDuration } from '../utils/geoUtils.js';

/**
 * Controller for Waste Recovery Hubs (Collectors & Factories)
 */

// GET all collectors with optional filters & proximity ranking
export async function getCollectors(request, reply) {
  const { wasteType, district, lat, lng, maxDistanceKm, search } = request.query;

  let items = [];

  if (isDbLive()) {
    try {
      const query = {};
      if (district && district !== 'All' && district.toLowerCase() !== 'all chennai') {
        if (district.toLowerCase() === 'chennai') {
          query.$or = [{ city: /^chennai$/i }, { district: /^chennai$/i }];
        } else {
          query.$or = [
            { district: new RegExp(`^${district}$`, 'i') },
            { zone: new RegExp(`^${district}$`, 'i') },
            { address: new RegExp(district, 'i') }
          ];
        }
      }
      if (wasteType && wasteType !== 'all') {
        query['acceptedWasteTypes.category'] = wasteType;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { zone: { $regex: search, $options: 'i' } }
        ];
      }

      const docs = await Collector.find(query).lean();
      items = docs.map(d => ({ ...d, _id: d._id.toString() }));
    } catch (err) {
      items = [...memoryStore.collectors];
    }
  } else {
    items = [...memoryStore.collectors];

    if (district && district !== 'All' && district.toLowerCase() !== 'all chennai') {
      if (district.toLowerCase() === 'chennai') {
        items = items.filter(c => (c.city && c.city.toLowerCase() === 'chennai') || (c.district && c.district.toLowerCase() === 'chennai'));
      } else {
        items = items.filter(c =>
          (c.district && c.district.toLowerCase() === district.toLowerCase()) ||
          (c.zone && c.zone.toLowerCase() === district.toLowerCase()) ||
          (c.address && c.address.toLowerCase().includes(district.toLowerCase()))
        );
      }
    }
    if (wasteType && wasteType !== 'all') {
      items = items.filter(c => (c.acceptedWasteTypes || []).some(w => (typeof w === 'string' ? w === wasteType : w.category === wasteType)));
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.zone && c.zone.toLowerCase().includes(q)) ||
        c.address.toLowerCase().includes(q)
      );
    }
  }

  // Distance calculation if user coords provided
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const hasCoordinates = !isNaN(userLat) && !isNaN(userLng);

  items = items.map(collector => {
    let distanceKm = null;
    let durationMin = null;
    let isWithinServiceBoundary = true;

    if (hasCoordinates) {
      distanceKm = calculateDistance(userLat, userLng, collector.lat, collector.lng);
      durationMin = estimateDriveDuration(distanceKm);
      const radius = collector.serviceRadiusKm || 8;
      isWithinServiceBoundary = distanceKm <= radius;
    }

    return {
      ...collector,
      distanceKm,
      durationMin,
      isWithinServiceBoundary
    };
  });

  if (hasCoordinates) {
    items.sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));
  }

  if (maxDistanceKm && hasCoordinates) {
    const maxD = parseFloat(maxDistanceKm);
    if (!isNaN(maxD)) {
      items = items.filter(item => item.distanceKm <= maxD);
    }
  }

  return {
    success: true,
    count: items.length,
    userLocation: hasCoordinates ? { lat: userLat, lng: userLng } : null,
    collectors: items
  };
}

// GET all Chennai industrial factories
export async function getFactories(request, reply) {
  const { search, district, lat, lng } = request.query || {};
  let items = [...(memoryStore.factories || [])];

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(f =>
      f.name.toLowerCase().includes(q) ||
      (f.zone && f.zone.toLowerCase().includes(q)) ||
      (f.primaryCategory && f.primaryCategory.toLowerCase().includes(q)) ||
      f.address.toLowerCase().includes(q)
    );
  }

  if (district && district !== 'All' && district.toLowerCase() !== 'all chennai' && district.toLowerCase() !== 'chennai') {
    items = items.filter(f =>
      f.district.toLowerCase() === district.toLowerCase() ||
      (f.zone && f.zone.toLowerCase() === district.toLowerCase())
    );
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const hasCoordinates = !isNaN(userLat) && !isNaN(userLng);

  if (hasCoordinates) {
    items = items.map(f => {
      const distanceKm = calculateDistance(userLat, userLng, f.lat, f.lng);
      return {
        ...f,
        distanceKm,
        durationMin: estimateDriveDuration(distanceKm)
      };
    }).sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));
  }

  return {
    success: true,
    count: items.length,
    factories: items
  };
}

// POST create a new dealer collection point (Admin or Dealer)
export async function createCollector(request, reply) {
  const {
    name,
    district = 'Guindy',
    zone,
    city = 'Chennai',
    address,
    lat = 13.0067,
    lng = 80.2012,
    phone,
    email = '',
    tnpcbRegNo,
    operatingHours = '08:00 AM - 07:00 PM',
    serviceRadiusKm = 8,
    serviceWards = [],
    dealerUserId = '',
    acceptedWasteTypes = [],
    description = '',
    pointType = 'dealer'
  } = request.body || {};

  if (!name || !address) {
    return reply.code(400).send({
      success: false,
      message: 'Name and address are required to create a collection point.'
    });
  }

  const newPoint = {
    _id: `col_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name,
    district,
    zone: zone || district,
    city,
    address,
    lat: parseFloat(lat) || 13.0827,
    lng: parseFloat(lng) || 80.2707,
    phone: phone || '+91 94440 00000',
    email,
    tnpcbRegNo: tnpcbRegNo || `TNPCB/CHN/REG/${Date.now().toString().slice(-4)}`,
    rating: 4.8,
    totalReviews: 8,
    operatingHours,
    serviceRadiusKm: parseFloat(serviceRadiusKm) || 8,
    serviceWards: Array.isArray(serviceWards) && serviceWards.length > 0 ? serviceWards : [district],
    dealerUserId,
    pointType,
    capacityLoad: 30,
    isVerified: true,
    description: description || `Authorized Chennai circular recovery facility in ${district}.`,
    acceptedWasteTypes: Array.isArray(acceptedWasteTypes) && acceptedWasteTypes.length > 0 ? acceptedWasteTypes : [
      { category: 'plastic', ratePerKg: 19, acceptsDropoff: true, acceptsPickup: true },
      { category: 'metal', ratePerKg: 38, acceptsDropoff: true, acceptsPickup: true },
      { category: 'paper', ratePerKg: 15, acceptsDropoff: true, acceptsPickup: true }
    ],
    createdAt: new Date()
  };

  if (isDbLive()) {
    try {
      await Collector.create(newPoint);
    } catch (e) {
      console.warn('DB write note for new collector point:', e.message);
    }
  }
  memoryStore.collectors.unshift(newPoint);

  await logAudit({
    action: 'DEALER_POINT_CREATED',
    category: 'ADMIN',
    actor: { id: dealerUserId || 'admin', name: name, role: 'admin' },
    targetResource: 'Collector',
    targetId: newPoint._id,
    details: `Created new dealer collection point: ${name} (${district}) with ${newPoint.serviceRadiusKm} km waste collection boundary.`
  });

  return {
    success: true,
    message: `Dealer collection point '${name}' added successfully with ${newPoint.serviceRadiusKm} km coverage boundary!`,
    collector: newPoint
  };
}

// DELETE a dealer collection point
export async function deleteCollector(request, reply) {
  const { id } = request.params;
  const index = memoryStore.collectors.findIndex(c => c._id === id || c.name === id);
  if (index !== -1) {
    const deleted = memoryStore.collectors.splice(index, 1)[0];
    if (isDbLive()) {
      try {
        await Collector.findByIdAndDelete(id);
      } catch (e) {}
    }
    await logAudit({
      action: 'DEALER_POINT_DELETED',
      category: 'ADMIN',
      actor: { id: 'admin', name: 'Admin', role: 'admin' },
      targetResource: 'Collector',
      targetId: id,
      details: `Deleted dealer collection point: ${deleted.name}`
    });
    return { success: true, message: `Dealer collection point '${deleted.name}' deleted successfully.` };
  }
  return reply.code(404).send({ success: false, message: 'Collector point not found' });
}

// GET single collector
export async function getCollectorById(request, reply) {
  const { id } = request.params;
  let collector = null;

  if (isDbLive()) {
    try {
      collector = await Collector.findById(id).lean();
    } catch (e) {}
  }

  if (!collector) {
    collector = memoryStore.collectors.find(c => c._id === id || c.name === id);
  }

  if (!collector) {
    return reply.code(404).send({ success: false, message: 'Collector not found' });
  }

  return { success: true, collector };
}

// POST find nearest collector
export async function getNearestCollectors(request, reply) {
  const { lat, lng, wasteType, district, limit = 5 } = request.body || {};

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return reply.code(400).send({ success: false, message: 'Valid lat and lng are required' });
  }

  let allCollectors = memoryStore.collectors;

  let filtered = allCollectors;
  if (wasteType && wasteType !== 'all') {
    filtered = filtered.filter(c => (c.acceptedWasteTypes || []).some(w => (typeof w === 'string' ? w === wasteType : w.category === wasteType)));
  }
  if (district && district !== 'All' && district.toLowerCase() !== 'all chennai') {
    if (district.toLowerCase() === 'chennai') {
      filtered = filtered.filter(c => (c.city && c.city.toLowerCase() === 'chennai') || (c.district && c.district.toLowerCase() === 'chennai'));
    } else {
      filtered = filtered.filter(c =>
        (c.district && c.district.toLowerCase() === district.toLowerCase()) ||
        (c.zone && c.zone.toLowerCase() === district.toLowerCase())
      );
    }
  }

  const calculated = filtered.map(c => {
    const distanceKm = calculateDistance(userLat, userLng, c.lat, c.lng);
    const radius = c.serviceRadiusKm || 8;
    return {
      ...c,
      _id: c._id ? c._id.toString() : undefined,
      distanceKm,
      durationMin: estimateDriveDuration(distanceKm),
      isWithinServiceBoundary: distanceKm <= radius
    };
  });

  calculated.sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = calculated.slice(0, parseInt(limit, 10));

  return {
    success: true,
    origin: { lat: userLat, lng: userLng },
    wasteType: wasteType || 'all',
    nearestCollectors: nearest,
    bestMatch: nearest[0] || null
  };
}

// GET unique districts/zones list
export async function getDistricts(request, reply) {
  let collectors = memoryStore.collectors;
  const districtCounts = {};

  collectors.forEach(c => {
    const name = c.zone || c.district || 'Chennai';
    districtCounts[name] = (districtCounts[name] || 0) + 1;
  });

  const list = Object.keys(districtCounts).sort().map(d => ({
    name: d,
    collectorCount: districtCounts[d]
  }));

  return {
    success: true,
    districts: list
  };
}
