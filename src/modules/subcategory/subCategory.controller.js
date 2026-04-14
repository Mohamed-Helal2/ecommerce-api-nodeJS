import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubCategory } from "../../../DB/model/subCategory.model.js";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/model/category.model.js";
export const createSubCategory = asyncHandler(
    async (req, res, next) => {
        const categoryId = req.params.category;
        console.log(categoryId);
        // check category 
        const category = await Category.findById(categoryId);
        if (!category) return next(new Error('category Id not valid'));
        // check file
        if (!req.file) return next(new Error('Sub category image is required', { cause: 400 }));
        // uplaod image to cloudinary
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `/${process.env.CLOUD_FOLDER_NAME}/subcategory/`
        })
        // save Sub Category
        await SubCategory.create({
            name: req.body.name,
            category: categoryId,
            slug: slugify(req.body.name),
            createdBy: req.user._id,
            image: { id: public_id, url: secure_url }
        })
        // save data in mongodb
        return res.status(200).json({
            messgae: 'add category sucessfully',
        })
    }
)


export const updateSubCategory = asyncHandler(

    async (req, res, next) => {
        // check id is exis or not
        const subCategoryId = req.params.id;
        const categoryId = req.params.category;
        console.log(subCategoryId);
        console.log(categoryId);

        const category = await Category.findById(categoryId);
        if (!category) return next(new Error('category not found', { cause: 400 }));
        // check category owner
        // if (req.user.id.toString() !== category.createdBy.toString()) return next(new Error('Not allowed to update the category !'))
        const subCategory = await SubCategory.findOne({
            _id: subCategoryId,
            //   category:categoryId
        });

        if (!subCategory) return next(new Error('Sub Category not found', { cause: 404 }));
        // check categoryid in sub category == category id or not 
        // if(categoryId !== subCategory.category) return next(new Error('sub category is not related to this category'));
        // check file 
        if (req.file) {
            // Use the correct property name 'id' from your Schema
            await cloudinary.uploader.destroy(subCategory.image.id);
            const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory`
            });
            subCategory.image = { id: public_id, url: secure_url };
        }
        if (req.body.name) {
            subCategory.name = req.body.name;
            subCategory.slug = slugify(req.body.name, { lower: true });
        }
        await subCategory.save();
        return res.status(200).json({
            success: true,
            message: 'Sub Category updated successfully!',
            results: subCategory
        });
    }
)


export const deleteSubCategory = asyncHandler(
    async (req, res, next) => {
        const categoryId = req.params.category;
        const { id } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) return next(new Error('category not found', { cause: 400 }));
        // check sub category
        const subcategory = await SubCategory.findOne({
            _id: id,
            category: categoryId
        });
        if (!subcategory) return next(new Error('sub category not found'));
        // check category owner
        if (req.user.id.toString() !== subcategory.createdBy.toString()) return next(new Error('Not allowed to delete this sub Category !'));
        await cloudinary.uploader.destroy(subcategory.image.id);
        await subcategory.deleteOne();
        // await subcategory.findByIdAndDelete(id);
        return res.json({
            sucess: true,
            messgae: 'delete Sub category sucessfully',
        })
    }
)

// get all sub catergory
export const getAllSubCategories = asyncHandler(
    async (req, res, next) => {
        const categoryId = req.params.category;
        const subcategory = categoryId ? await SubCategory.find({
            category: categoryId
        }, { name: 1, _id: 0 }) : 
        // await SubCategory.find({}, { name: 1, _id: 0 }).populate([
        //    {path:'category',select: "name -_id"},{path:"createdBy",select:"userName -_id"}
        // ]);
        // nested populate
        await SubCategory.find({}, { name: 1, _id: 0 }).populate([
           {path:'category',select: "name -_id",populate : [{path:"createdBy", select :"userName email -_id"}]}
        ]);
        return res.json({
            sucess: true,
            subCategory: subcategory
        });
    }
)
