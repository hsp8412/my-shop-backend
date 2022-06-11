"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cart_product.init(
    {
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Cart id is required" },
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
      modelName: "cart_product",
    }
  );
  return cart_product;
};
