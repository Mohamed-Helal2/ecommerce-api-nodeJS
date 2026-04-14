import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";
export const createOrderSchema = Joi.object({
    phone: Joi.string().required(),
    address: Joi.string().required(),
    payment: Joi.string().valid("cash", "visa").default("cash"),
    coupon:Joi.string().length(5),
}).required();


export const cancelOrderSchema = Joi.object({
    id:Joi.custom(objectIdValidation).required(),
}).required();