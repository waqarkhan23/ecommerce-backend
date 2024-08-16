import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Order from "../models/order.model.js";
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot delete admin user" });
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const totalUsers = async (req, res) => {
  try {
    const totalUsers = await User.find({ role: "user" }).countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const totalCategories = async (req, res) => {
  try {
    const totalCategories = await Category.find().countDocuments();
    res.status(200).json({ totalCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const topSellingProduct = async (req, res) => {
  try {
    const topProduct = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          name: "$productDetails.name",
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json(topProduct[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
