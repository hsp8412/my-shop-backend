"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, product, cart_product }) {
      // define association here
      this.belongsTo(user, { foreignKey: "userId" });
      this.belongsToMany(product, {
        through: cart_product,
      });
    }
  }
  cart.init(
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
    },

    {
      sequelize,
      modelName: "cart",
    }
  );
  return cart;
};
