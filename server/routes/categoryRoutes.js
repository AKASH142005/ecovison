import { getCategories, getCategoryById } from '../controllers/categoryController.js';

export default async function categoryRoutes(fastify, options) {
  fastify.get('/categories', getCategories);
  fastify.get('/categories/:id', getCategoryById);
}
