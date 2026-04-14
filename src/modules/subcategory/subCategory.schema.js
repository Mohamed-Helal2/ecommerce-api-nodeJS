import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";

export const CreateSubCategory= Joi.object({
    name:Joi.string().min(5).max(20).required(),
    category:Joi.custom(objectIdValidation).required()
}).required();

export const UpdateSubCategory= Joi.object({
    name:Joi.string().min(5).max(20).required(),
    id:Joi.custom(objectIdValidation).required() , // sub category Id
    category :Joi.custom(objectIdValidation).required()   // category Id
}).required();


export const deleteSubCategory = Joi.object({
    id: Joi.custom(objectIdValidation).required(),
    category :Joi.custom(objectIdValidation).required() 
}).required();

export const getsubCategories = Joi.object({
     category :Joi.custom(objectIdValidation)
}).required();