const joi = require("joi");
function validateCategory(category) {
  const schema = joi
    .object({
      name: joi.string().min(1).max(50).required(),
    })
    .unknown(true);
  return schema.validate(category);
}

module.exports.validateCategory = validateCategory;
