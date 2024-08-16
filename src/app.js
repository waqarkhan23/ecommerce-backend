import express from "express";
import GlobalErrorHandler from "./middlewares/GlobalErrorHandler.js";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import loadingRouter from "./routes/loading.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/loading", loadingRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

app.get("/test", authMiddleware, (req, res) => {
  res.json({ success: true, message: "This is a test route" });
});

app.use(GlobalErrorHandler);

export default app;
