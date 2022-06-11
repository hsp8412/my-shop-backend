"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ order, cart }) {
      // define association here
      this.hasMany(order, { foreignKey: "userId" });
      this.hasOne(cart, { foreignKey: "userId" });
    }
  }
  user.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First name is required" },
          notEmpty: { msg: "First name is required" },
          len: {
            args: [1, 50],
            msg: "First name must be between 1 and 50 characters",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Last name is required" },
          notNull: { msg: "Last name is required" },
          len: {
            args: [1, 50],
            msg: "Last name must be between 1 and 50 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: true,
          len: {
            args: [1, 100],
            msg: "Email must be between 1 and 50 characters",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          notNull: { msg: "Password is required" },
          len: {
            args: [1, 100],
            msg: "Password must be between 1 and 100 characters",
          },
        },
      },
      streetAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Street address is required" },
          notEmpty: { msg: "Street address is required" },
          len: {
            args: [1, 300],
            msg: "Street address must be between 1 and 300 characters",
          },
        },
      },
      aptOrSuite: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Invalid Apt/Suite" },
          len: {
            args: [1, 50],
            msg: "Apt/Suite must be between 1 and 50 characters",
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "City is required" },
          notEmpty: { msg: "City is required" },
          len: {
            args: [1, 50],
            msg: "City must be between 1 and 50 characters",
          },
        },
      },
      province: {
        type: DataTypes.ENUM(
          "ON",
          "QC",
          "BC",
          "AB",
          "MB",
          "SK",
          "NS",
          "NB",
          "NL",
          "NT",
          "NU",
          "YT",
          "PE"
        ),
        allowNull: false,
        validate: {
          notNull: { msg: "Province is required" },
          isIn: {
            args: [
              [
                "ON",
                "QC",
                "BC",
                "AB",
                "MB",
                "SK",
                "NS",
                "NB",
                "NL",
                "NT",
                "NU",
                "YT",
                "PE",
              ],
            ],
            msg: "Province is required",
          },
        },
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Postal code is required" },
          notEmpty: { msg: "Postal code is required" },
          len: {
            args: [1, 6],
            msg: "Postal code must be between 1 and 6 characters",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Invalid phone number" },
          len: {
            args: [1, 20],
            msg: "Phone number must be between 1 and 20 characters",
          },
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      membershipType: {
        type: DataTypes.ENUM("basic", "premium"),
        defaultValue: "basic",
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
