const joi = require("joi");

const validateAuthInfo = (authInfo) => {
  const schema = joi
    .object({
      email: joi.string().min(1).max(100).email().required(),
      password: joi.string().min(8).required(),
    })
    .unknown(true);
  return schema.validate(authInfo);
};

const validateUser = (user) => {
  const schema = joi
    .object({
      email: joi.string().min(1).max(100).email().required(),
      firstName: joi.string().min(1).max(50).required(),
      lastName: joi.string().min(1).max(50).required(),
      password: joi.string().required().min(8).max(100).required(),
      streetAddress: joi.string().min(1).max(300).required(),
      aptOrSuite: joi.string().max(50),
      city: joi.string().min(1).max(50).required(),
      province: joi
        .any()
        .valid(
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
        )
        .required(),
      postalCode: joi.string().min(1).max(6).required(),
      phone: joi.string().max(20),
      isAdmin: joi.boolean(),
      isActive: joi.boolean(),
      membershipType: joi.any().valid("basic", "premium"),
    })
    .unknown(true);
  return schema.validate(user);
};

const validatePassword = (password) => {
  const schema = joi
    .object({
      currentPassword: joi.string().required().min(8).max(100).required(),
      password: joi.string().required().min(8).max(100).required(),
    })
    .unknown(true);
  return schema.validate(password);
};

const validateInfoUpdate = (user) => {
  const schema = joi
    .object({
      firstName: joi.string().min(1).max(50).required(),
      lastName: joi.string().min(1).max(50).required(),
      phone: joi.string().min(1).max(20),
    })
    .unknown(true);
  return schema.validate(user);
};

const validateUserUpdate = (user) => {
  const schema = joi
    .object({
      email: joi.string().min(1).max(100).email().required(),
      firstName: joi.string().min(1).max(50).required(),
      lastName: joi.string().min(1).max(50).required(),
      streetAddress: joi.string().min(1).max(300).required(),
      aptOrSuite: joi.string().min(1).max(50),
      city: joi.string().min(1).max(50).required(),
      province: joi
        .any()
        .valid(
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
        )
        .required(),
      postalCode: joi.string().min(1).max(6).required(),
      phone: joi.string().min(1).max(20),
      isAdmin: joi.boolean(),
      isActive: joi.boolean(),
      membershipType: joi.any().valid("basic", "premium"),
    })
    .unknown(true);
  return schema.validate(user);
};

const validateAddressUpdate = (address) => {
  const schema = joi.object({
    streetAddress: joi.string().max(300).required(),
    aptOrSuite: joi.string().max(50),
    city: joi.string().max(50).required(),
    province: joi
      .string()
      .valid(
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
      )
      .required(),
    postalCode: joi.string().min(1).max(6).required(),
  });
  return schema.validate(address);
};

module.exports = {
  validateUser,
  validatePassword,
  validateUserUpdate,
  validateAuthInfo,
  validateInfoUpdate,
  validateAddressUpdate,
};
