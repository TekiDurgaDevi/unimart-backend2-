const Product = require("../models/product");

// ================================
// ADD PRODUCT
// ================================
const addProduct = async (req, res) => {
  try {
    const { title, price, category, condition } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      title,
      price,
      category,
      condition,
      image: req.file.path, // uploads/filename.png
      seller: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to add product" });
  }
};

// ================================
// GET MY PRODUCTS
// ================================
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch my products" });
  }
};

// ================================
// ✅ GET PUBLIC PRODUCTS (FIXED)
// ================================
const getPublicProducts = async (req, res) => {
  try {
    let filter = {};

    // if logged in, exclude own products
    if (req.user) {
      filter = { seller: { $ne: req.user._id } };
    }

    const products = await Product.find(filter)
      .populate("seller", "name email"); // ✅ FIX

    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ================================
// GET PRODUCT BY ID
// ================================
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("seller", "name email"); // ✅ IMPORTANT

  res.json(product);
};

// ================================
// DELETE PRODUCT
// ================================
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }

  await product.deleteOne();
  res.json({ message: "Deleted" });
};

// ================================
// UPDATE PRODUCT
// ================================
const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }

  product.title = req.body.title || product.title;
  product.price = req.body.price || product.price;
  product.category = req.body.category || product.category;
  product.condition = req.body.condition || product.condition;

  if (req.file) {
    product.image = req.file.path;
  }

  await product.save();
  res.json(product);
};

module.exports = {
  addProduct,
  getMyProducts,
  getPublicProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
