"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, product, order_product }) {
      // define association here
      this.belongsTo(user, { foreignKey: "userId" });
      this.belongsToMany(product, {
        through: order_product,
      });
    }
  }
  order.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User id is required" },
        },
      },
      status: {
        type: DataTypes.ENUM([
          "pending",
          "confirmed",
          "shipped",
          "completed",
          "cancelled",
          "refunded",
        ]),
        defaultValue: "pending",
      },
    },

    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
