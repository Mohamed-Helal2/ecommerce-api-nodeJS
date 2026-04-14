import { Router } from "express";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import * as OC from "./order.controller.js";
import * as OS from "./order.schema.js";
export const orderRouter= new Router();

// create order
orderRouter.post("/",
    authnticatedMiddleware,
    authorizedMiddleware(['user']),
    validationMiddleware(OS.createOrderSchema)
    ,OC.createOrder);

// cancel order
orderRouter.patch("/:id",
    authnticatedMiddleware,
    authorizedMiddleware(['user']),
    validationMiddleware(OS.cancelOrderSchema)
    ,OC.cancelOrder);