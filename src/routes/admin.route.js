import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllUser,
  deleteUser,
  totalUsers,
  totalCategories,
  topSellingProduct,
} from "../controllers/admin.controller.js";
const adminRouter = Router();

adminRouter.get("/users", authMiddleware, isAdmin, getAllUser);
adminRouter.delete("/delete-user/:userId", authMiddleware, isAdmin, deleteUser);
adminRouter.get("/total-users", authMiddleware, isAdmin, totalUsers);
adminRouter.get("/total-categories", authMiddleware, isAdmin, totalCategories);
adminRouter.get(
  "/top-selling-product",
  authMiddleware,
  isAdmin,
  topSellingProduct
);

export default adminRouter;
