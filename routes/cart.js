const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const db = require("../models");

router.get("/", userAuth, async (req, res) => {
  const userUUID = req.userUUID;
  try {
    const user = await db.user.findOne({
      where: { uuid: userUUID },
    });
    if (!user) return res.status(400).send("User not found");
    const cart = await db.cart.findOne({
      where: { userId: user.id },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//save cart to database
router.post("/", userAuth, async (req, res) => {
  const userUUID = req.userUUID;
  try {
    const user = await db.user.findOne({
      where: { uuid: userUUID },
    });
    if (!user) return res.status(400).send("User not found");
    const cart = await db.cart.findOne({
      where: { userId: user.id },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    const items = req.body.items;
    for (item of items) {
      const product = await db.product.findOne({ where: { uuid: item.uuid } });
      if (!product) return res.status(404).json({ err: "Product not found" });
      await cart.addProduct(product, { through: { quantity: item.quantity } });
    }
    cart = await db.cart.findOne({
      where: { userId: user.id },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//clear cart
router.delete("/", userAuth, async (req, res) => {
  const userUUID = req.userUUID;
  try {
    const user = await db.user.findOne({
      where: { uuid: userUUID },
    });
    if (!user) return res.status(400).send("User not found");
    const cart = await db.cart.findOne({
      where: { userId: user.id },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    await db.cart_product.destroy({
      where: { cartId: cart.id },
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
