import { Router } from "express";
import * as BC from "./brand.controller.js";
import * as BS from "./brand.schema.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";
export const brandRouter = Router();

brandRouter.post('/',
    authnticatedMiddleware,
    authorizedMiddleware(['admin']),
    fileUpload().single('brand'),
    validationMiddleware(BS.createBrandSchema),
    BC.createBrand);

// update Brand    
brandRouter.patch('/:id',
    authnticatedMiddleware,
    authorizedMiddleware(['admin']),
    fileUpload().single('brand'),
    validationMiddleware(BS.updateBrandSchema),
    BC.updateBrand);

    brandRouter.delete('/:id',
    authnticatedMiddleware,
    authorizedMiddleware(['admin']), 
    validationMiddleware(BS.deleteBrandSchema),
    BC.deleteBrand);


    brandRouter.get('/',BC.getAllBrands);
