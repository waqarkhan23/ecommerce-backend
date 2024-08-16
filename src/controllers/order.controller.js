import Order from "../models/order.model.js";

export const getUserOrders = async (req, res) => {
  const userId = req.user._id;
  // Retrieve all orders for the given user ID
  const orders = await Order.find({ buyer: userId });
  res.status(200).json(orders);
};

export const newOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({
      status: { $in: ["Pending", "Processing"] },
    });
    res.status(200).json({ newOrders: totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
try {
 const allOrders = await Order.find().populate("buyer").select("-password");

 res.status(200).json({success: true, orders: allOrders  });
} catch (error) {
  res.status(500).json({ message: error.message });
}
}

export const updateOrderStatus = async(req,res)=>{
  const {orderId,status} =req.body
  try {
    const order = await Order.findByIdAndUpdate(orderId, {status}, {new: true});
    res.status(200).json({sucess: true, order: order  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


}