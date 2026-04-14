import { asyncHandler } from "../utils/asyncHandler.js";

export const authorizedMiddleware =(roles)=>{
    return async(req,res,next)=>{
        // check user role 
        if(!roles.includes(req.user.role)){
             return next(new Error("Not authorized", { cause: 403 }));
        }
        return next();
    }
}