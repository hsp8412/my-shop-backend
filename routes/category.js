const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const { validateCategory } = require("../validation/category");
const db = require("../models");

router.get("/", adminAuth, async (req, res) => {
  try {
    const categories = await db.category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/", adminAuth, async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let category = await db.category.findOne({
      where: { name: req.body.name },
    });
    if (category) return res.status(400).send("Category already exists");
    category = await db.category.create(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:uuid", adminAuth, async (req, res) => {
  try {
    const category = await db.category.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!category) return res.status(404).send("Category not found");
    const categoryDeleted = await category.destroy();
    res.json(categoryDeleted);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
