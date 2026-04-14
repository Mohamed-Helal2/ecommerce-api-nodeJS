import { Router } from "express";
import * as CC from "./category.controller.js";
import { authnticatedMiddleware } from "../../middleware/auth.middleware.js";
import { authorizedMiddleware } from "../../middleware/authorization.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
 import { fileUpload } from "../../utils/fileUpload.js";
import* as CategorySchema from "./category.schema.js";
import { subCategoryRouter } from "../subcategory/subCategory.router.js";
 export const categoryRouter = Router();

categoryRouter.use('/:category/subcategory',subCategoryRouter);

// create category
categoryRouter.post('/create',
   authnticatedMiddleware,
   authorizedMiddleware(['admin']),
     fileUpload().single('category'), 
validationMiddleware(CategorySchema.createCategory),
 CC.createCategory);

 // update category
 categoryRouter.patch('/:id', authnticatedMiddleware,
   authorizedMiddleware(['admin']),
     fileUpload().single('category'), 
validationMiddleware(CategorySchema.updateCategory), CC.updateCategory);

// delete category 
 categoryRouter.delete('/:id', authnticatedMiddleware,
   authorizedMiddleware(['admin']),validationMiddleware(CategorySchema.deleteCategory), CC.deleteCategory);

// get all categories
categoryRouter.get('/',CC.getAllCategories);