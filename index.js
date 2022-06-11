const express = require("express");
const server = express();
const db = require("./models");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const cors = require("cors");

server.use(cors());

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use("/api/user", userRoutes);
server.use("/api/auth", authRoutes);
server.use("/api/category", categoryRoutes);

const port = process.env.PORT || 4000;

db.sequelize.sync({ alter: true }).then(() => {
  server.listen(port, () => {
    console.log(`listening at: http://localhost:${port}`);
  });
});
