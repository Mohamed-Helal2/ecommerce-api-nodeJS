import { Router } from "express";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
import * as CC from "./cart.controller.js";
import * as Cs from "./cart.schema.js";

export const cartRouter= new Router();

// add to cart
cartRouter.post('/',
      authnticatedMiddleware,
      authorizedMiddleware(['user']),
       validationMiddleware(Cs.addToCartSchema),
     CC.addToCart );

         // get user cart by userId
       cartRouter.get('/',
      authnticatedMiddleware,
     authorizedMiddleware(['user','admin']),
        validationMiddleware(Cs.getUserCartSchema),
      CC.getUserCart );

     // update cart
 cartRouter.patch('/',
      authnticatedMiddleware,
     authorizedMiddleware(['user']),
        validationMiddleware(Cs.updateUserCartSchema),
      CC.updateCart );
 

     // remove product from cart
 cartRouter.patch('/remove-item',
      authnticatedMiddleware,
     authorizedMiddleware(['user']),
        validationMiddleware(Cs.removeItemFromCartSchema),
      CC.removeItemFromCart );

     // clear cart

 cartRouter.put('/clear',
      authnticatedMiddleware,
     authorizedMiddleware(['user']),
      
      CC.clearCart );
