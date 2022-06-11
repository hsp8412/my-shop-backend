const express = require("express");
const server = express();
const db = require("./models");
const cors = require("cors");

server.use(cors());

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const port = process.env.PORT || 4000;

db.sequelize.sync({ force: true }).then(() => {
  server.listen(port, () => {
    console.log(`listening at: http://localhost:${port}`);
  });
});
