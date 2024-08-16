import { Router } from "express";
import {
  registerUser,
  login,
  verify,
  forgotPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(login);
authRouter.get("/verify", authMiddleware, verify);
authRouter.get("/verify-admin", authMiddleware, isAdmin, (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User verified successfully as admin",
    user: req.user,
  });
});
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
