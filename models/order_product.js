"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order_product.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Order id is required" },
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Product id is required" },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Quantity is required" },
          isInt: { msg: "Quantity must be an integer" },
          min: { args: [1], msg: "Quantity must be at least 1" },
          max: { args: [100], msg: "Quantity must be at most 100" },
        },
      },
    },
    {
      sequelize,
      modelName: "order_product",
    }
  );
  return order_product;
};
