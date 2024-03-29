const express = require("express");
const server = express();
const db = require("./models");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// console.log(process.env.NODE_ENV);

server.use(cors());

server.get("/", function (req, res, next) {
  res.status(200).send("Welcome to Sipeng's shop!");
});

server.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];
    const endpointSecret = process.env.END_POINT_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    const fulfillOrder = async (session) => {
      //get the order
      const order = await db.order.findOne({
        where: { uuid: session.metadata.orderId },
      });
      //change status
      order.set({
        status: "confirmed",
      });
      await order.save();
      console.log("Fulfilling order", session);
    };

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Fulfill the purchase...
      await fulfillOrder(session);
    }

    response.status(200).end();
  }
);

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/api/user", userRoutes);
server.use("/api/auth", authRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/product", productRoutes);
server.use("/api/order", orderRoutes);
server.use("/api/cart", cartRoutes);

const port = process.env.PORT || 4000;

// db.sequelize.sync({ force: true }).then(() => {
// console.log("synced");
server.listen(port, () => {
  console.log(`listening at: http://localhost:${port}`);
});
// });
