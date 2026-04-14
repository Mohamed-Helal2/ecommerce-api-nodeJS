import Joi from "joi";
import { objectIdValidation } from "../../middleware/validation.middleware.js";
export const addReviewScehma=Joi.object({
    productId:Joi.string().custom(objectIdValidation).required(),
    comment:Joi.string().required(),
    rating:Joi.number().min(1).max(5).required(),
});
export const updateReviewScehma=Joi.object({
    id:Joi.string().custom(objectIdValidation).required(),
    comment:Joi.string(),
    rating:Joi.number().min(1).max(5),
});
