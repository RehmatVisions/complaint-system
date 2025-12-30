import Joi from "joi";

export const complaintValidationSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().required(),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent").required(),
  status: Joi.string().optional()
});
