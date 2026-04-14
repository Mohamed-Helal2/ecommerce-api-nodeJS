import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";
export const addToCartSchema = Joi.object({
    productId: Joi.custom(objectIdValidation).required(),
    quantity: Joi.number().min(1).default(1)
}).required()


export const getUserCartSchema =Joi.object({
    cartId:Joi.custom(objectIdValidation)
})


export const updateUserCartSchema=Joi.object({
       productId: Joi.custom(objectIdValidation).required(),
    quantity: Joi.number().min(1).default(1)
}).required()

export const removeItemFromCartSchema =Joi.object({
    productId: Joi.custom(objectIdValidation).required(),
}).required();


export const clearCartSchema = Joi.object({
    cartId: Joi.custom(objectIdValidation).required(),
}).required();