import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("Token has expired", 401);
      }
      throw new AppError("Invalid token", 401);
    }

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
      throw new AppError(
        "The user belonging to this token no longer exists",
        401
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  const user = req.user;
  try {
    const SearchedUser = User.findById(req.user._id);
    if (user.role !== "admin") {
      res
        .status(403)
        .send({ message: "Unauthorized to perform this action middleware" });
    } else {
      req.isAdmin = true;
      next();
    }
  } catch (error) {
    return next(error);
  }
};

export { authMiddleware, isAdmin };
