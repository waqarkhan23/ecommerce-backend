import { Router } from "express";
import Product from "../models/product.model.js";
const loadingRouter = Router();
import braintree from "braintree";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Order from "../models/order.model.js";

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "c63srpzbwyhn4vn3",
  publicKey: "47x2t9swf27jzjsh",
  privateKey: "20d1442fc5271459f0152adbb149e370",
});

loadingRouter.get("/product-list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category")
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

loadingRouter.get("/braintree/token", async (req, res) => {
  try {
    const clientToken = await gateway.clientToken.generate();
    res.status(200).json({ success: true, clientToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

loadingRouter.post("/braintree/checkout", authMiddleware, async (req, res) => {
  try {
    const { cart, nonce, total } = req.body;
    const result = await gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      const order = await Order.create({
        buyer: req.user._id,
        products: cart,
        totalPrice: total,
        braintreeId: result.transaction.id,
      });
      res
        .status(200)
        .json({
          success: true,
          message: "Order placed successfully",
          orderId: order._id,
        });
    } else {
      res.status(400).json({ success: false, message: "Transaction failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default loadingRouter;
