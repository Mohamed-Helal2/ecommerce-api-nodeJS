import { Router } from "express";
import * as CC from "./coupon.controller.js";
import * as CS from "./coupon.schema.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
export const couponRouter=new Router();

couponRouter.post("/",
    authnticatedMiddleware,
    authorizedMiddleware(['seller']),
    validationMiddleware(CS.createCouponSchema),CC.createCoupon);
// update Coupon
couponRouter.patch("/:code",
    authnticatedMiddleware,
    authorizedMiddleware(['seller']),
    validationMiddleware(CS.updateCouponSchema),
    CC.updateCoupon);

// delete Coupon
couponRouter.delete("/:code",
    authnticatedMiddleware,
    authorizedMiddleware(['seller']),
    validationMiddleware(CS.deleteCouponSchema),
    CC.deleteCoupon);
// get all coupon
couponRouter.get("/",
    authnticatedMiddleware,
      authorizedMiddleware(['seller','admin']),
    // validationMiddleware(CS.deleteCouponSchema),
    CC.getAllCoupon);

