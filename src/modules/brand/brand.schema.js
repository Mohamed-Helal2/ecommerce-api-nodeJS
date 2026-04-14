import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

// create brand validation
export const createBrandSchema=Joi.object({
    name:Joi.string().min(2).max(12).required(),
    categories:Joi.array().items(Joi.string().custom(objectIdValidation).required()).required(),
    // subCategories:Joi.array().items(Joi.string().custom(objectIdValidation).required()).required(),
}).required();


export const updateBrandSchema=Joi.object({
     id: Joi.custom(objectIdValidation).required(),
     name:Joi.string().min(2).max(12).optional(),    
}).required();

export const deleteBrandSchema=Joi.object({
     id: Joi.custom(objectIdValidation).required(),
}).required();