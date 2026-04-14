import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/model/category.model.js";
import slugify from "slugify";
export const createCategory = asyncHandler(
    async (req, res, next) => {
        // check file
        if (!req.file) return next(new Error('category image is required', { cause: 400 }));
        // uplaod image to cloudinary
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `/${process.env.CLOUD_FOLDER_NAME}/category`
        })
        await Category.create({
            name: req.body.name,
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
export const getAllCategory = asyncHandler(
    async (req, res, next) => {
        return res.json({
            messgae: 'get all category',
        })
    }
)
export const updateCategory = asyncHandler(

    async (req, res, next) => {
        // check id is exis or not
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) return next(new Error('invalid category id', { cause: 400 }));
        // check category owner
        if (req.user.id.toString() !== category.createdBy.toString()) return next(new Error('Not allowed to update the category !'))
        // check file 
        if (req.file) {
            // Use the correct property name 'id' from your Schema
            await cloudinary.uploader.destroy(category.image.id);
            const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.CLOUD_FOLDER_NAME}/category`
            });
            category.image = { id: public_id, url: secure_url };
        }
        if (req.body.name) {
            category.name = req.body.name;
            category.slug = slugify(req.body.name, { lower: true });
        }
        await category.save();
        return res.status(200).json({
            success: true,
            message: 'Category updated successfully!',
            results: category
        });
    }
)
export const deleteCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) return next(new Error('invalid category id', { cause: 400 }));
        // check category owner
        if (req.user.id.toString() !== category.createdBy.toString()) return next(new Error('Not allowed to update the category !'));
        await cloudinary.uploader.destroy(category.image.id);
       // await Category.findByIdAndDelete(id);
       await category.deleteOne();
        return res.json({
            sucess: true,
            messgae: 'delete category sucessfully',
        })
    }
)


export const getAllCategories =asyncHandler(
    async(req,res,next)=>{
        const categories=await Category.find({},{name:1,testName:1})
       // .populate({path:"subcategory",select:"name -_id"});
      console.log(categories);  // [mongoose document]
      
        return res.json({
            sucess:true,
            message:'get all categories',
            categories
        })
}
);