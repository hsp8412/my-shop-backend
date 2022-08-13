const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
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

router.post("/create-checkout-session", userAuth,async (req,res)=>{
  //validate order
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  //get the customer info
  const userUUID = req.userUUID;
  const user = await db.user.findOne({ where: { uuid: userUUID } });
  if (!user) return res.status(404).json({ err: "User not found" });

  //get the products info
  const items = req.body.items;
  let items_to_purchase = [];
  for (item of items) {
    const product = await db.product.findOne({ where: { uuid: item.uuid } });
    if (!product) return res.status(404).json({ err: "Product not found" });
    items_to_purchase.push({...product.dataValues,quantity:item.quantity})
  }


  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      mode:"payment",
      client_reference_id: userUUID,
      metadata:{
        orderId: req.body.orderId
      },
      line_items: items_to_purchase.map(item => {
        return {
          price_data:{
            currency:"cad",
            product_data:{
              name: item.name,
            },
            unit_amount: item.price*100
          },
          quantity:item.quantity
        }
      }),
      success_url: `${process.env.CLIENT_URL}/user/orders`,
      cancel_url: `${process.env.CLIENT_URL}/user/cart`
    })
    res.json({url:session.url})
  } catch (e){
    res.status(500).json({error:e.message})
  }
})


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

router.patch("/:uuid/payment-received",userAuth, async (req, res) => {
  //get the user
  const userUUID = req.userUUID;
  const user = await db.user.findOne({
    where: {uuid: userUUID}
  })
  if (!user) return res.status(400).send("User not found.");

  //get the order
  const order = await db.order.findOne({
    where: {uuid: req.params.uuid, userId: user.id}
  });

  //change status
  order.set({
    status: "confirmed"
  })
  await order.save();
  res.status(200);
})

module.exports = router;
