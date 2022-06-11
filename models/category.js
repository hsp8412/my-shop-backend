"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ product }) {
      // define association here
      this.hasMany(product, { foreignKey: "categoryId" });
    }

    toJSON() {
      const values = super.toJSON();
      delete values.createdAt;
      delete values.updatedAt;
      delete values.id;
      return values;
    }
  }
  category.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        unique: "name",
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull: { msg: "Name is required" },
          len: {
            args: [1, 50],
            msg: "Name must be between 1 and 50 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "category",
    }
  );
  return category;
};
