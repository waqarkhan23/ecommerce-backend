import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";

import {
  allProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  filterProducts,
  totalProducts,
} from "../controllers/product.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
const productRouter = Router();

productRouter.get("/", allProducts);
productRouter.post(
  "/create-product",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  createProduct
);
productRouter.get("/:id", getProductById);

productRouter.delete(
  "/delete-product/:id",
  authMiddleware,
  isAdmin,
  deleteProduct
);

productRouter.put(
  "/update-product/:id",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  updateProduct
);
productRouter.post("/filter-products", filterProducts);

productRouter.post("/total-products", totalProducts);

export default productRouter;
