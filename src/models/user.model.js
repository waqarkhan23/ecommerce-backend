import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  console.log("Pre-save middleware triggered");
  console.log("Is password modified:", user.isModified("password"));
  if (!user.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    console.log("Password hashed successfully");
  } catch (error) {
    console.error("Error hashing password:", error);
    return next(error);
  }
  next();
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("question")) return next();
  const hashedPassword = await bcrypt.hash(user.question, 10);
  user.question = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  const user = this;
  const isMatch = await bcrypt.compare(plainPassword, user.password);
  return isMatch;
};

userSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
