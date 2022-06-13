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

server.use(cors());

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/api/user", userRoutes);
server.use("/api/auth", authRoutes);
server.use("/api/category", categoryRoutes);
server.use("/api/product", productRoutes);
server.use("/api/order", orderRoutes);
server.use("/api/cart", cartRoutes);

const port = process.env.PORT || 4000;

db.sequelize.sync({ alter: true }).then(() => {
  server.listen(port, () => {
    console.log(`listening at: http://localhost:${port}`);
  });
});
