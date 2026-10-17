import { Collector } from '../models/Collector.js';
import { isDbLive, memoryStore } from '../config/db.js';

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function estimateDriveDuration(distanceKm) {
  const avgSpeedKmH = 35; // City traffic average speed
  const minutes = Math.max(5, Math.round((distanceKm / avgSpeedKmH) * 60));
  return minutes;
}

export default async function collectorRoutes(fastify, options) {
  // GET all collectors with optional filters & proximity ranking
  fastify.get('/collectors', async (request, reply) => {
    const { wasteType, district, lat, lng, maxDistanceKm, search } = request.query;

    let items = [];

    if (isDbLive()) {
      try {
        const query = {};
        if (district && district !== 'All') {
          query.district = new RegExp(`^${district}$`, 'i');
        }
        if (wasteType && wasteType !== 'all') {
          query['acceptedWasteTypes.category'] = wasteType;
        }
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } }
          ];
        }

        const docs = await Collector.find(query).lean();
        items = docs.map(d => ({ ...d, _id: d._id.toString() }));
      } catch (err) {
        items = [...memoryStore.collectors];
      }
    } else {
      items = [...memoryStore.collectors];

      if (district && district !== 'All') {
        items = items.filter(c => c.district.toLowerCase() === district.toLowerCase());
      }
      if (wasteType && wasteType !== 'all') {
        items = items.filter(c => c.acceptedWasteTypes.some(w => w.category === wasteType));
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
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

      if (hasCoordinates) {
        distanceKm = calculateDistance(userLat, userLng, collector.lat, collector.lng);
        durationMin = estimateDriveDuration(distanceKm);
      }

      return {
        ...collector,
        distanceKm,
        durationMin
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
  });

  // GET single collector
  fastify.get('/collectors/:id', async (request, reply) => {
    const { id } = request.params;
    let collector = null;

    if (isDbLive()) {
      try {
        collector = await Collector.findById(id).lean();
      } catch (e) {
        // ID might be non-ObjectId format if fallback ID
      }
    }

    if (!collector) {
      collector = memoryStore.collectors.find(c => c._id === id || c.name === id);
    }

    if (!collector) {
      return reply.code(404).send({ success: false, message: 'Collector not found' });
    }

    return { success: true, collector };
  });

  // POST find nearest collector
  fastify.post('/collectors/nearest', async (request, reply) => {
    const { lat, lng, wasteType, district, limit = 5 } = request.body || {};

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (isNaN(userLat) || !userLng) {
      return reply.code(400).send({ success: false, message: 'Valid lat and lng are required' });
    }

    let allCollectors = [];
    if (isDbLive()) {
      try {
        allCollectors = await Collector.find().lean();
      } catch (err) {
        allCollectors = [...memoryStore.collectors];
      }
    } else {
      allCollectors = [...memoryStore.collectors];
    }

    let filtered = allCollectors;
    if (wasteType && wasteType !== 'all') {
      filtered = filtered.filter(c => c.acceptedWasteTypes.some(w => w.category === wasteType));
    }
    if (district && district !== 'All') {
      filtered = filtered.filter(c => c.district.toLowerCase() === district.toLowerCase());
    }

    const calculated = filtered.map(c => {
      const distanceKm = calculateDistance(userLat, userLng, c.lat, c.lng);
      return {
        ...c,
        _id: c._id ? c._id.toString() : undefined,
        distanceKm,
        durationMin: estimateDriveDuration(distanceKm)
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
  });

  // GET unique districts list
  fastify.get('/districts', async () => {
    let collectors = isDbLive() ? await Collector.find().lean() : memoryStore.collectors;
    const districtCounts = {};

    collectors.forEach(c => {
      districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
    });

    const list = Object.keys(districtCounts).sort().map(d => ({
      name: d,
      collectorCount: districtCounts[d]
    }));

    return {
      success: true,
      districts: list
    };
  });
}
