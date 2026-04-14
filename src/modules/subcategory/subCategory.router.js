import { Router } from "express";
import *  as SC from "./subCategory.controller.js";
import * as SS from "./subCategory.schema.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { fileUpload } from "../../utils/fileUpload.js";

export const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter.post('/',
    authnticatedMiddleware,
    authorizedMiddleware(['admin']),
    fileUpload().single('subcategory'),
    validationMiddleware(SS.CreateSubCategory),
    SC.createSubCategory);

    // update
subCategoryRouter.patch('/:id', authnticatedMiddleware,
    authorizedMiddleware(['admin']),
    fileUpload().single('subcategory'),
    validationMiddleware(SS.UpdateSubCategory), SC.updateSubCategory);


// delete

subCategoryRouter.delete("/:id",
    authnticatedMiddleware,
       authorizedMiddleware(['admin']),
    validationMiddleware(SS.deleteSubCategory),SC.deleteSubCategory);

// get all category
subCategoryRouter.get('/',
     validationMiddleware(SS.getsubCategories),
    SC.getAllSubCategories);