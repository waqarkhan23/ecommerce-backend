import { Router } from "express";
import { getUserOrders, newOrders,getAllOrders,updateOrderStatus } from "../controllers/order.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
const orderRouter = Router();

// Add routes for order operations here...
orderRouter.get("/user-orders", authMiddleware, getUserOrders);
orderRouter.get("/new-orders", authMiddleware, isAdmin, newOrders);
orderRouter.get("/all-orders", authMiddleware, isAdmin, getAllOrders);
orderRouter.post("/update-order", authMiddleware, isAdmin,updateOrderStatus );

export default orderRouter;
