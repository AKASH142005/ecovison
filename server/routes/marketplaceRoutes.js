import { MaterialRequirement } from '../models/MaterialRequirement.js';
import { PurchaseOrder } from '../models/PurchaseOrder.js';
import { DealerInventory } from '../models/DealerInventory.js';
import { memoryStore, isDbLive, logAudit } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function marketplaceRoutes(fastify, options) {
  // Public/Authenticated list of requirements
  fastify.get('/marketplace/requirements', async (request) => {
    const { category, district, status = 'open' } = request.query || {};

    let reqs = memoryStore.requirements;
    if (isDbLive()) {
      try {
        const query = {};
        if (category && category !== 'all') query.category = category;
        if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');
        if (status && status !== 'all') query.status = status;
        reqs = await MaterialRequirement.find(query).sort({ createdAt: -1 }).lean();
      } catch (e) {
        reqs = memoryStore.requirements;
      }
    }

    if (category && category !== 'all') {
      reqs = reqs.filter(r => r.category === category);
    }
    if (district && district !== 'All') {
      reqs = reqs.filter(r => r.district.toLowerCase() === district.toLowerCase());
    }

    return {
      success: true,
      count: reqs.length,
      requirements: reqs
    };
  });

  // Factory publishes a material requirement
  fastify.post(
    '/marketplace/requirements',
    { preHandler: [requireRole('factory', 'admin')] },
    async (request, reply) => {
      const {
        category,
        grade = 'Standard Recycled Grade',
        quantityNeededKg,
        offeredPricePerKg,
        deadline,
        deliveryAddress,
        notes = ''
      } = request.body || {};

      if (!category || !quantityNeededKg || !offeredPricePerKg) {
        return reply.code(400).send({
          success: false,
          message: 'Category, quantityNeededKg, and offeredPricePerKg are required'
        });
      }

      const factoryId = request.user.facilityId || request.user.id;
      const factoryName = request.user.facilityName || request.user.name;
      const district = request.user.district || 'Tamil Nadu';
      const requirementId = `REQ-TN-${Math.floor(100 + Math.random() * 900)}`;

      const newReq = {
        _id: `req_${Date.now()}`,
        requirementId,
        factoryId,
        factoryName,
        category,
        grade,
        quantityNeededKg: parseFloat(quantityNeededKg),
        fulfilledKg: 0,
        offeredPricePerKg: parseFloat(offeredPricePerKg),
        district,
        deliveryAddress: deliveryAddress || request.user.address || `${district} SIPCOT Complex`,
        deadline: deadline || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        status: 'open',
        notes,
        createdAt: new Date()
      };

      memoryStore.requirements.unshift(newReq);

      if (isDbLive()) {
        try {
          await MaterialRequirement.create(newReq);
        } catch (e) {
          console.warn('Requirement db write fallback:', e.message);
        }
      }

      await logAudit({
        action: 'REQUIREMENT_PUBLISHED',
        category: 'MARKETPLACE',
        actor: request.user,
        targetResource: 'MaterialRequirement',
        targetId: requirementId,
        details: `Factory ${factoryName} published requirement for ${quantityNeededKg} kg of ${category.toUpperCase()} at ₹${offeredPricePerKg}/kg in ${district}.`
      });

      return reply.code(201).send({
        success: true,
        message: 'Bulk material requirement successfully published to Tamil Nadu B2B Circular Marketplace',
        requirement: newReq
      });
    }
  );

  // Dealer creates a purchase order / supply commitment to a factory requirement
  fastify.post(
    '/marketplace/orders',
    { preHandler: [requireRole('dealer', 'admin')] },
    async (request, reply) => {
      const { requirementId, quantityKg, vehicleNumber, notes = '' } = request.body || {};

      if (!requirementId || !quantityKg) {
        return reply.code(400).send({
          success: false,
          message: 'requirementId and quantityKg are required'
        });
      }

      const commitWeight = parseFloat(quantityKg);
      const dealerId = request.user.facilityId || request.user.id || 'mem_col_1';
      const dealerName = request.user.facilityName || request.user.name;

      // Find the requirement
      let req = memoryStore.requirements.find(
        r => r.requirementId === requirementId || r._id === requirementId
      );
      if (!req && isDbLive()) {
        req = await MaterialRequirement.findOne({
          $or: [{ requirementId }, { _id: requirementId }]
        });
      }

      if (!req) {
        return reply.code(404).send({ success: false, message: 'Material requirement not found' });
      }

      // Check dealer inventory
      const invRecord = memoryStore.inventory.find(
        i => (i.dealerId === dealerId || i.dealerId === 'mem_col_1') && i.category === req.category
      );

      const available = invRecord ? invRecord.availableKg : 0;
      if (available < commitWeight) {
        return reply.code(400).send({
          success: false,
          message: `Insufficient inventory. You have ${available} kg of ${req.category} in stock, but attempted to commit ${commitWeight} kg.`
        });
      }

      const poNumber = `PO-TN-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = Math.round(commitWeight * req.offeredPricePerKg);

      const newPO = {
        _id: `po_${Date.now()}`,
        poNumber,
        requirementId: req.requirementId,
        factoryId: req.factoryId,
        factoryName: req.factoryName,
        dealerId,
        dealerName,
        category: req.category,
        quantityKg: commitWeight,
        unitPrice: req.offeredPricePerKg,
        totalAmount,
        status: 'created',
        vehicleNumber: vehicleNumber || '',
        dispatchDate: '',
        verifiedWeightKg: 0,
        qualityGrade: 'Pending Delivery',
        verificationNotes: notes,
        paymentStatus: 'unpaid',
        paymentRef: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      memoryStore.orders.unshift(newPO);

      // Update requirement fulfilledKg
      req.fulfilledKg = (req.fulfilledKg || 0) + commitWeight;
      if (req.fulfilledKg >= req.quantityNeededKg) {
        req.status = 'fulfilled';
      }

      if (isDbLive()) {
        try {
          await PurchaseOrder.create(newPO);
          if (typeof req.save === 'function') await req.save();
        } catch (e) {
          console.warn('PO db write fallback:', e.message);
        }
      }

      await logAudit({
        action: 'PURCHASE_ORDER_CREATED',
        category: 'MARKETPLACE',
        actor: request.user,
        targetResource: 'PurchaseOrder',
        targetId: poNumber,
        details: `Dealer ${dealerName} created purchase order ${poNumber} to supply ${commitWeight} kg ${req.category.toUpperCase()} to ${req.factoryName} (Value: ₹${totalAmount}).`
      });

      return reply.code(201).send({
        success: true,
        message: `Purchase Order ${poNumber} created for ₹${totalAmount.toLocaleString()}`,
        purchaseOrder: newPO
      });
    }
  );

  // GET orders (filtered by role)
  fastify.get('/marketplace/orders', { preHandler: [authenticate] }, async (request) => {
    const { role, facilityId, id } = request.user;
    const actorId = facilityId || id;

    let orders = memoryStore.orders;
    if (isDbLive()) {
      try {
        let filter = {};
        if (role === 'dealer') filter = { $or: [{ dealerId: actorId }, { dealerId: 'mem_col_1' }] };
        else if (role === 'factory') filter = { $or: [{ factoryId: actorId }, { factoryId: 'fac_tiruppur_1' }] };
        orders = await PurchaseOrder.find(filter).sort({ createdAt: -1 }).lean();
      } catch (e) {
        orders = memoryStore.orders;
      }
    }

    if (role === 'dealer') {
      orders = orders.filter(o => o.dealerId === actorId || o.dealerId === 'mem_col_1');
    } else if (role === 'factory') {
      orders = orders.filter(o => o.factoryId === actorId || o.factoryId === 'fac_tiruppur_1');
    }

    return {
      success: true,
      count: orders.length,
      orders
    };
  });

  // Dealer marks shipment dispatched (deducts from dealer availableKg inventory!)
  fastify.patch(
    '/marketplace/orders/:id/ship',
    { preHandler: [requireRole('dealer', 'admin')] },
    async (request, reply) => {
      const { id } = request.params;
      const { vehicleNumber, dispatchDate = new Date().toISOString().split('T')[0] } = request.body || {};

      let po = memoryStore.orders.find(o => o._id === id || o.poNumber === id);
      if (!po && isDbLive()) {
        po = await PurchaseOrder.findOne({ $or: [{ _id: id }, { poNumber: id }] });
      }

      if (!po) {
        return reply.code(404).send({ success: false, message: 'Purchase Order not found' });
      }

      if (po.status !== 'created') {
        return reply.code(400).send({
          success: false,
          message: `Order is already in status '${po.status}'`
        });
      }

      po.status = 'shipped';
      po.vehicleNumber = vehicleNumber || po.vehicleNumber || 'TN Truck Dispatch';
      po.dispatchDate = dispatchDate;
      po.updatedAt = new Date();

      // Deduct committed stock from dealer's inventory
      const invRecord = memoryStore.inventory.find(
        i => i.dealerId === po.dealerId && i.category === po.category
      );
      if (invRecord) {
        invRecord.availableKg = Math.max(0, Math.round((invRecord.availableKg - po.quantityKg) * 10) / 10);
        invRecord.totalDispatchedKg = Math.round((invRecord.totalDispatchedKg + po.quantityKg) * 10) / 10;
        invRecord.updatedAt = new Date();
      }

      if (isDbLive()) {
        try {
          if (typeof po.save === 'function') await po.save();
          await DealerInventory.findOneAndUpdate(
            { dealerId: po.dealerId, category: po.category },
            {
              $inc: { availableKg: -po.quantityKg, totalDispatchedKg: po.quantityKg },
              $set: { updatedAt: new Date() }
            }
          );
        } catch (e) {
          console.warn('Shipment inventory deduction fallback:', e.message);
        }
      }

      await logAudit({
        action: 'SHIPMENT_DISPATCHED',
        category: 'MARKETPLACE',
        actor: request.user,
        targetResource: 'PurchaseOrder',
        targetId: po.poNumber,
        details: `Dispatched shipment for ${po.poNumber} (${po.quantityKg} kg ${po.category.toUpperCase()}) to ${po.factoryName} via vehicle ${po.vehicleNumber}. Dealer stock deducted.`
      });

      return {
        success: true,
        message: `Shipment marked in transit. Dealer inventory updated.`,
        purchaseOrder: po
      };
    }
  );

  // Factory verifies incoming shipment & quality
  fastify.patch(
    '/marketplace/orders/:id/verify',
    { preHandler: [requireRole('factory', 'admin')] },
    async (request, reply) => {
      const { id } = request.params;
      const { verifiedWeightKg, qualityGrade, notes = '' } = request.body || {};

      let po = memoryStore.orders.find(o => o._id === id || o.poNumber === id);
      if (!po && isDbLive()) {
        po = await PurchaseOrder.findOne({ $or: [{ _id: id }, { poNumber: id }] });
      }

      if (!po) {
        return reply.code(404).send({ success: false, message: 'Purchase Order not found' });
      }

      const verifiedWeight = parseFloat(verifiedWeightKg) || po.quantityKg;
      const grade = qualityGrade || 'Grade A (Verified Industrial Standard)';

      po.status = 'verified';
      po.verifiedWeightKg = verifiedWeight;
      po.qualityGrade = grade;
      po.verificationNotes = notes;
      po.verifiedAt = new Date();
      po.totalAmount = Math.round(verifiedWeight * po.unitPrice);
      po.updatedAt = new Date();

      if (isDbLive() && typeof po.save === 'function') {
        await po.save();
      }

      await logAudit({
        action: 'SHIPMENT_VERIFIED',
        category: 'MARKETPLACE',
        actor: request.user,
        targetResource: 'PurchaseOrder',
        targetId: po.poNumber,
        details: `Factory ${request.user.facilityName || request.user.name} verified shipment ${po.poNumber}. Verified: ${verifiedWeight} kg [${grade}]. Payable amount: ₹${po.totalAmount}.`
      });

      return {
        success: true,
        message: `Shipment verified! Final payable amount calculated as ₹${po.totalAmount.toLocaleString()}`,
        purchaseOrder: po
      };
    }
  );

  // Factory or Admin clears and releases payment
  fastify.patch(
    '/marketplace/orders/:id/payment',
    { preHandler: [requireRole('factory', 'admin')] },
    async (request, reply) => {
      const { id } = request.params;
      const { paymentStatus = 'paid', paymentRef } = request.body || {};

      let po = memoryStore.orders.find(o => o._id === id || o.poNumber === id);
      if (!po && isDbLive()) {
        po = await PurchaseOrder.findOne({ $or: [{ _id: id }, { poNumber: id }] });
      }

      if (!po) {
        return reply.code(404).send({ success: false, message: 'Purchase Order not found' });
      }

      const ref = paymentRef || `NEFT-TN-${Math.floor(100000 + Math.random() * 900000)}`;

      po.paymentStatus = paymentStatus;
      po.paymentRef = ref;
      po.paymentReleasedAt = new Date();
      po.updatedAt = new Date();

      if (isDbLive() && typeof po.save === 'function') {
        await po.save();
      }

      await logAudit({
        action: 'PAYMENT_RELEASED',
        category: 'PAYMENT',
        actor: request.user,
        targetResource: 'PurchaseOrder',
        targetId: po.poNumber,
        details: `Payment of ₹${po.totalAmount.toLocaleString()} released to ${po.dealerName} for ${po.poNumber}. Ref: ${ref}.`
      });

      return {
        success: true,
        message: `Payment of ₹${po.totalAmount.toLocaleString()} cleared for ${po.poNumber}. Reference: ${ref}`,
        purchaseOrder: po
      };
    }
  );
}
