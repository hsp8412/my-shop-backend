const express = require("express");
const router = express.Router();
const db = require("../models");
const { userAuth, adminAuth } = require("../middleware/auth");
const { validateOrder } = require("../validation/order");

//admin get all orders
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const orders = await db.order.findAll({
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: {
            attributes: ["quantity"],
          },
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//admin get one order by uuid
router.get("/admin/order/:uuid", adminAuth, async (req, res) => {
  try {
    const order = await db.order.findOne({
      where: { uuid: req.params.uuid },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//user get all his or her orders
router.get("/user", userAuth, async (req, res) => {
  const userUUID = req.userUUID;
  try {
    const user = await db.user.findOne({
      where: { uuid: userUUID },
    });
    if (!user) return res.status(400).send("User not found");
    const orders = await db.order.findAll({
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
    res.json(orders);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//admin get orders of a user
router.get("/admin/user/:uuid", adminAuth, async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { uuid: req.params.uuid },
    });
    if (!user) return res.status(400).send("User not found");
    const orders = await db.order.findAll({
      where: {
        userId: user.id,
      },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//create an order
router.post("/", userAuth, async (req, res) => {
  const userUUID = req.userUUID;
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });
  try {
    const user = await db.user.findOne({ where: { uuid: userUUID } });
    if (!user) return res.status(404).json({ err: "User not found" });

    const order = await db.order.create({
      userId: user.id,
    });

    const items = req.body.items;
    for (item of items) {
      const product = await db.product.findOne({ where: { uuid: item.uuid } });
      if (!product) return res.status(404).json({ err: "Product not found" });
      await order.addProduct(product, { through: { quantity: item.quantity } });
    }
    const result = await db.order.findOne({
      where: { id: order.id },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//delete an order
router.delete("/:uuid", adminAuth, async (req, res) => {
  try {
    const order = await db.order.findOne({
      where: { uuid: req.params.uuid },
      include: [
        { model: db.user, attributes: ["uuid", "email"] },
        {
          model: db.product,
          attributes: ["uuid", "name"],
          through: { attributes: ["quantity"] },
        },
      ],
    });
    if (!order) return res.status(404).json({ err: "Order not found" });
    await order.destroy();
    res.json(order);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
