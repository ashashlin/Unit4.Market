import express from "express";
import { getProductById, getProducts } from "#db/queries/products";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { getOrdersByProductId } from "#db/queries/orders";

const productsRouter = express.Router();

// GET /products
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// middleware for all routes that contain id
productsRouter.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product not found.");

  req.product = product;
  next();
});

// GET /products/:id
productsRouter.get("/:id", async (req, res, next) => {
  try {
    res.send(req.product);
  } catch (error) {
    next(error);
  }
});

// GET /products/:id/orders
productsRouter.get(
  "/:id/orders",
  getUserFromToken,
  requireUser,
  async (req, res, next) => {
    try {
      const productId = req.product.id;
      const userId = req.user.id;

      const orders = await getOrdersByProductId(productId, userId);
      if (orders.length === 0)
        return res.send("No orders found for this product.");

      res.send(orders);
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;
