import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/model/category.model.js";
import cloudinary from "../../utils/cloud.js";
import { Brand } from "../../../DB/model/brand.model.js";
import slugify from "slugify";
export const createBrand = asyncHandler(
    async (req, res, next) => {
        // check categories
        const { categories, name } = req.body //[objectId];
        await categories.forEach(async (Id) => {
            const category = await Category.findById(Id);
            if (!category) return next(new Error(`this category not Exist with Id ${Id}`, { cause: 404 }))
        });
        // check file
        if (!req.file) return next(new Error('Brand Image is Required', { cause: 400 }));
        // uplaod file to cloudinary
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `/${process.env.CLOUD_FOLDER_NAME}/brands`
        });
        const brand = await Brand.create({
            name: name,
            slug: slugify(name),
            createdBy: req.user._id,
            image: { id: public_id, url: secure_url },
            // save brand in each category
        });
       // await Category.updateMany({ _id: { $in: categories } }, { $push: { brands: brand._id } });
        categories.forEach(async (Id) => {
            await Category.findByIdAndUpdate(Id, { $push: { brands: brand._id } });
        });
        return res.status(201).json({
            sucess: true,
            message: 'create Brand sucessfully',
            brand
        })
    }
)

export const updateBrand = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const brand = await Brand.findById(id);
        if (!brand) return next(new Error('this brand not exist',{
            cause:404
        }));
        // check file
        if (req.file) {
            // destroy old photo
            await cloudinary.uploader.destroy(brand.image.id);
            const { secure_url, public_id } =
             await cloudinary.uploader.upload(
             
             req.file.path
            );
            brand.image = { id: public_id, url: secure_url };
        }
        if (req.body.name) {
            brand.name = req.body.name;
            brand.slug = slugify(brand.name);
        }
        await brand.save();

        return res.json({
            sucess: true,
            message: "update brand sucessfully"
        })
    }
);

export const deleteBrand=asyncHandler(
    async(req,res,next)=>{
        // check id
        const {id}=req.params;
        const brand = await Brand.findById(id);
        if (!brand) return next(new Error('this brand not exist',{
            cause:404
        }));
        // delete brand from his categories
        await Category.updateMany({ brands: brand._id }, { $pull: { brands: brand._id } });
        //check file
        if(brand.image){
            await cloudinary.uploader.destroy(brand.image.id);
        }
        await Brand.findByIdAndDelete(id);  
        // delete from DB
        return res.json({
            sucess:true,
            message:"deleted Brand Sucessfuly"
        })
    }
)


export const getAllBrands = asyncHandler(
    async(req,res,next)=>{
        if(req.querey.category){
            
        }
        const brands=await Brand.find({},{name:1,_id:0});
        return res.json({
            sucess:true,
            brands
        })
    }
)