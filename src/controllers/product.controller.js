import Product from "../models/product.model.js";
import cloudinary from "../utils/Cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const allProducts = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const options = { page, limit, sort: { createdAt: -1 } };
    // const products = await Product.paginate({}, options);
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category");
    res.status(200).json({
      success: true,
      message: "All Products",
      countTotal: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const image = req.file;
  const { name, description, price, category, stock } = req.body;
  console.log(name, description, price, category, stock);

  if (!image || !name || !description || !price || !category || !stock) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const uploadImage = await cloudinary.uploader.upload(image.path, {
      folder: "products",
      quality: "auto",
      filename_override: image.filename,
      format: image.mimetype.split("/")[1],
    });
    const { secure_url } = uploadImage;
    await fs.unlinkSync(
      path.resolve(__dirname, "../../public/data/uploads/", image.filename)
    );

    const product = await Product.create({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      stock,
      image: secure_url,
    });
    if (product) {
      res.status(201).json({ success: true, data: product });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product founded", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const publicId = product.image.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.uploader.destroy(`products/${publicId}`);
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product and associated image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const image = req.file;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update image if a new one is provided
    let imageUrl = product.image;
    if (image) {
      // Delete old image from Cloudinary
      const oldPublicId = product.image.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`products/${oldPublicId}`);

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(image.path, {
        folder: "products",
        quality: "auto",
        filename_override: image.filename,
        format: image.mimetype.split("/")[1],
      });
      imageUrl = uploadResult.secure_url;

      // Delete temporary file
      await fs.unlinkSync(image.path);
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        category: category || product.category,
        stock: stock || product.stock,
        image: imageUrl,
        slug: name ? slugify(name) : product.slug,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const filterProducts = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log("Received filters:", { checked, radio });

    const args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args).sort({ createdAt: -1 });
    const populatedProducts = await Product.populate(products, "category");

    res.status(200).json({
      success: true,
      message: "Filtered Products",
      data: populatedProducts,
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const totalProducts = async (req, res) => {
  try {
    const products = await Product.find().estimatedDocumentCount();

    res.status(200).json({
      success: true,

      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
