const express = require("express");
const router = express.Router();
const db = require("../models");
const { auth, adminAuth } = require("../middleware/auth");
const { validateProduct } = require("../validation/product");

//get all products
router.get("/", async (req, res) => {
  try {
    const products = await db.product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//get one product by uuid
router.get("/:uuid", async (req, res) => {
  try {
    const product = await db.product.findOne({
      where: { uuid: req.params.uuid },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//create a new product
router.post("/", adminAuth, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const category = await db.category.findOne({
      where: { uuid: req.body.categoryUUID },
    });
    if (!category) return res.status(400).send("Category not found");
    let product = { ...req.body };
    product.categoryId = category.id;
    product = await db.product.create(product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//delete a product
router.delete("/:uuid", adminAuth, async (req, res) => {
  try {
    const product = await db.product.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!product) return res.status(400).send("Product not found");
    await product.destroy();
    res.json(product);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//update a product
router.put("/:uuid", adminAuth, async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const category = await db.category.findOne({
      where: { uuid: req.body.categoryUUID },
    });
    if (!category) return res.status(400).send("Category not found");
    const product = await db.product.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!product) return res.status(400).send("Product not found");
    const updatedProduct = await product.update(req.body);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
