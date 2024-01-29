const fs = require("fs");
require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: "#Hspmysql",
    database: "my-shop",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
};
