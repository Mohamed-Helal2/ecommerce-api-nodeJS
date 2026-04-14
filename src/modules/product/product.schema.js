import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

export const createProductSchema=Joi.object({
    name:Joi.string().min(2).max(20).required(),
    description:Joi.string().min(10).max(200),
    avaliableItems:Joi.number().
   // integer().options({convert:false}).
    min(1).required(),
    price:Joi.number().
   // integer().options({convert:false}).
    min(1).required(),
    discount:Joi.number().min(1).max(100),
    category:Joi.string().custom(objectIdValidation).required(),
    subCategory:Joi.string().custom(objectIdValidation).required(),
    brand:Joi.string().custom(objectIdValidation).required(),

}).required();


export const deleteProductSchema=Joi.object({
id:Joi.string().custom(objectIdValidation).required(),
}).required();