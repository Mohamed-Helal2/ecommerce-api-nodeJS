
import { asyncHandler } from "../utils/asyncHandler.js";
import { Types } from "mongoose";
export const validationMiddleware = (schema) =>
  asyncHandler(async (req, res, next) => {
    const data={...req.body,...req.params,...req.query}
    const { error, value } = schema.validate(data, {
      abortEarly: false,  // to get all errors not just the first one
    });
    if (error) {
      const errors = {};
      error.details.forEach(err => {
        const key = err.path[0];
        errors[key] = err.message.replace(/\"/g, "");
      });
      return res.status(400).json({
        message: "validation error",
        errors
      });
    }
    next();
  });

  export const objectIdValidation =(value,helper)=>{
        return Types.ObjectId.isValid(value)? true: helper.message('invalid object id');
     }