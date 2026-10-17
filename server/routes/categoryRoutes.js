import { WasteCategory } from '../models/WasteCategory.js';
import { isDbLive, memoryStore } from '../config/db.js';

export default async function categoryRoutes(fastify, options) {
  fastify.get('/categories', async () => {
    let categories = [];
    if (isDbLive()) {
      try {
        categories = await WasteCategory.find().lean();
      } catch (e) {
        categories = memoryStore.categories;
      }
    } else {
      categories = memoryStore.categories;
    }

    return {
      success: true,
      categories
    };
  });

  fastify.get('/categories/:id', async (request, reply) => {
    const { id } = request.params;
    let cat = null;

    if (isDbLive()) {
      try {
        cat = await WasteCategory.findOne({ id }).lean();
      } catch (e) {
        // Fallback
      }
    }

    if (!cat) {
      cat = memoryStore.categories.find(c => c.id === id);
    }

    if (!cat) {
      return reply.code(404).send({ success: false, message: 'Category not found' });
    }

    return { success: true, category: cat };
  });
}
