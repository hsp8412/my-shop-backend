const joi = require("joi");
function validateOrder(order) {
  const schema = joi
    .object({
      items: joi.array().items(
        joi.object({
          uuid: joi.string().min(1).max(37).required(),
          quantity: joi.number().min(1).max(100).required(),
        })
      ),
    })
    .unknown(true);
  return schema.validate(order);
}

module.exports.validateOrder = validateOrder;
