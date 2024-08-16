import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  singleCategory,
} from "../controllers/category.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/all-category", getAllCategories);
categoryRouter.post(
  "/create-category",
  authMiddleware,
  isAdmin,
  createCategory
);
categoryRouter.put(
  "/update-category/:id",
  authMiddleware,
  isAdmin,
  updateCategory
);

categoryRouter.delete(
  "/delete-category/:id",
  authMiddleware,
  isAdmin,
  deleteCategory
);
categoryRouter.get(
  "/single-category/:slug",

  singleCategory
);

export default categoryRouter;
