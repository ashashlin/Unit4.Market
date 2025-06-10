import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import { getProductById, getProductsByOrderId } from "#db/queries/products";
import { createOrderProduct } from "#db/queries/orders_products";

const ordersRouter = express.Router();

ordersRouter.use(getUserFromToken);
ordersRouter.use(requireUser);

// GET /orders
ordersRouter.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserId(userId);
    if (orders.length === 0) return res.send("No orders found.");

    res.send(orders);
  } catch (error) {
    next(error);
  }
});

// POST /orders
ordersRouter.post("/", requireBody(["date"]), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.body;
    const newOrder = await createOrder(date, userId);

    res.status(201).send(newOrder);
  } catch (error) {
    next(error);
  }
});

// middleware for all routes that contain id
ordersRouter.param("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order not found.");
  if (order.user_id !== req.user.id)
    return res.status(403).send("You do not have access to this order.");

  req.order = order;
  next();
});

// GET /orders/:id
ordersRouter.get("/:id", async (req, res, next) => {
  try {
    res.send(req.order);
  } catch (error) {
    next(error);
  }
});

// GET /orders/:id/products
ordersRouter.get("/:id/products", async (req, res, next) => {
  try {
    const orderId = req.order.id;
    const products = await getProductsByOrderId(orderId);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// POST /orders/:id/products
ordersRouter.post(
  "/:id/products",
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      const orderId = req.order.id;

      const product = await getProductById(productId);
      if (!product) return res.status(400).send("Product not found.");

      const newOrderProduct = await createOrderProduct(
        orderId,
        productId,
        quantity
      );
      res.status(201).send(newOrderProduct);
    } catch (error) {
      next(error);
    }
  }
);

export default ordersRouter;
