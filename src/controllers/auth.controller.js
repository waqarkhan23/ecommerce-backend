import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  try {
    const { name, password, address, email, phone, question } = req.body;
    if (!name || !password || !address || !email || !phone || !question) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    const createdUser = await User.create({
      name,
      password,
      address,
      email,
      phone,
      question,
    });
    const token = createdUser.generateToken();

    const userWithoutPassword = createdUser.toObject();
    delete userWithoutPassword.password;
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isMatched = await user.comparePassword(password, user.password);
    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = user.generateToken();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.json({
      success: true,
      message: "User logged in successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    return next(error);
  }
};
const verify = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User verified successfully",
    user: req.user,
  });
};

const forgotPassword = async (req, res) => {
  const { email, question, newpassword } = req.body;
  console.log(email, question, newpassword);
  try {
    if (!email || !question || !newpassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (question !== user.question) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid question or answer" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    const updatePassword = await user.updateOne({ password: hashedPassword });
    if (!updatePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to reset password" });
    }

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, login, verify, forgotPassword };
