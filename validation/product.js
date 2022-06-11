const joi = require("joi");
function validateProduct(product) {
  const schema = joi
    .object({
      name: joi.string().min(1).max(100).required(),
      price: joi.number().min(0).max(99999999).required(),
      imgUrl: joi.string().min(1).max(2048).required(),
      description: joi.string().min(1).max(5000).required(),
      categoryUUID: joi.string().min(1).max(37).required(),
      isAvailable: joi.boolean(),
      stock: joi.number().min(0).max(99999),
    })
    .unknown(true);
  return schema.validate(product);
}

module.exports.validateProduct = validateProduct;
