const Joi = require("joi");

const userValidateLogin = (data) => {
  const userSchema = Joi.object({
    email: Joi.string()
      .pattern(new RegExp("gmail.com"))
      .email()
      .lowercase()
      .required(),
    password: Joi.string().required(),
  });

  return userSchema.validate(data);
};

const campaignValidateCreate = (data) => {
  const campaignSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    startDate: Joi.allow(),
    endDate: Joi.allow(),
    quantity: Joi.number().required(),
    position: Joi.allow(),
    technology: Joi.allow(),
    recfile: Joi.allow(),
  });

  return campaignSchema.validate(data);
};

const profileValidateCreate = (data) => {
  const profileSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string()
      .pattern(new RegExp("gmail.com"))
      .email()
      .lowercase()
      .required(),
    phone: Joi.string().required(),
    detail: Joi.string(),
    id: Joi.string().required(),
  });

  return profileSchema.validate(data);
};

module.exports = {
  userValidateLogin,
  campaignValidateCreate,
  profileValidateCreate,
};
