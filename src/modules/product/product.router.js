import { Router } from "express";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
import * as PC from "./product.controller.js";
import * as PS from "./product.schema.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { reviewRouter } from "../review/review.router.js";
export const productRouter = new Router();
productRouter.use("/:productId/review",reviewRouter);
//  Create Product
productRouter.post('/', authnticatedMiddleware,
    authorizedMiddleware(['seller']),
    fileUpload().fields([
    { name: 'defaultImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
    ]),
    validationMiddleware(PS.createProductSchema),
    PC.createProduct
);

// delete Product
productRouter.delete('/:id', authnticatedMiddleware,
    authorizedMiddleware(['seller','admin']),
    validationMiddleware(PS.deleteProductSchema),
    PC.deleteProduct
);

// get product
productRouter.get('/',  PC.getProduct
);

