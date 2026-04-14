import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

export const createCategory = Joi.object({
    name : Joi.string().required().min(5).max(20),
}).required();

export const updateCategory = Joi.object({
    name : Joi.string().min(5).max(20),
    id: Joi.custom(objectIdValidation).required(),
}).required();


export const deleteCategory = Joi.object({
    id: Joi.custom(objectIdValidation).required()
}).required();



