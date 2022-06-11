"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ category, order, order_product, cart, cart_product }) {
      // define association here
      this.belongsTo(category, { foreignKey: "categoryId" });
      this.belongsToMany(order, {
        through: order_product,
      });
      this.belongsToMany(cart, {
        through: cart_product,
      });
    }
  }
  product.init(
    {
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
          len: {
            args: [1, 50],
            msg: "Name must be between 1 and 50 characters",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
          len: {
            args: [1, 1000],
            msg: "Description must be between 1 and 1000 characters",
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: "Price is required" },
          isDecimal: true,
          max: {
            args: 999999999999999,
            msg: "Price must be less than $9999999999999",
          },
          min: {
            args: 0,
            msg: "Price must be greater than $0",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image URL is required" },
          notEmpty: { msg: "Image URL is required" },
          isUrl: true,
          len: {
            args: [1, 1000],
            msg: "Image URL must be between 1 and 1000 characters",
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Category is required" },
        },
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
