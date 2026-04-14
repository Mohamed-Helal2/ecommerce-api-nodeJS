import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/model/category.model.js"
import { SubCategory } from "../../../DB/model/subCategory.model.js"
import { Brand } from "../../../DB/model/brand.model.js";
import { Product } from "../../../DB/model/product.model.js";
import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloud.js";

export const createProduct = asyncHandler(
    async (req, res, next) => {
        // category
        const category = await Category.findById(req.body.category);
        if (!category) return next(new Error('category not exist'));

        // sub category
        const subCategory = await SubCategory.findById(req.body.subCategory);
        if (!subCategory) return next(new Error('subCategory not exist'));

        // brand 
        const brnad = await Brand.findById(req.body.brand);
        console.log(req.body.brand);

        if (!brnad) return next(new Error('Brand not exist'));
        // check file
        if (!req.files) return next(new Error('Product image is required', { cause: 400 }));

        // create folder name
        const cloudFolder = nanoid();

        // //uplaod sub images
        let images = [];
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `/${process.env.CLOUD_FOLDER_NAME}/products/subImages/${cloudFolder}`
            })
            images.push({ id: public_id, url: secure_url });
        }

        // // uplaod default images
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.defaultImage[0].path, {
            folder: `/${process.env.CLOUD_FOLDER_NAME}/products/defaultImages/${cloudFolder}`
        });

        // create product
        const product = await Product.create({
            ...req.body,
            defaultImage: { id: public_id, url: secure_url },
            images,
            createdBy: req.user._id,
            cloudFolder
        })
        return res.json({
            sucess: true,
            message: 'created Product Sucrssfully',
            product
        })
    }
)

export const deleteProduct = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return next(new Error('this product not exist'));
        // check owner
        // product.images.forEach(async image   => {
        // await cloudinary.uploader.destroy(image.id);
        // });
        const ids = product.images.map((image) => image.id);
        ids.push(product.defaultImage.id);
        await cloudinary.api.delete_resources(ids)
        // delete folder
        await cloudinary.api.delete_folder(`/${process.env.CLOUD_FOLDER_NAME}/products/defaultImages/${product.cloudFolder}`)
        await cloudinary.api.delete_folder(`/${process.env.CLOUD_FOLDER_NAME}/products/subImages/${product.cloudFolder}`)
        // await cloudinary.uploader.destroy(product.defaultImage.id);
        await product.deleteOne();
        return res.json({
            sucess: true,
            message: "DELETE PRODUCT SUCESSFULLY"
        })
    }
)

// get all product
export const getProduct = asyncHandler(
    async (req, res, next) => {
        // req.query
        // const { search, price, avaliableItems, discount } = req.query;
        const { page, keyword, sort, category, brand, subcategory } = req.query;
        if (category && !(await Category.findById(category))) {
            return next(new Error('category not found!', { cause: 404 }));
        };
        if (subcategory && !(await SubCategory.findById(subcategory))) {
            return next(new Error('subcategory not found!', { cause: 404 }));
        };
        if (brand && !(await Brand.findById(brand))) {
            return next(new Error('brand not found!', { cause: 404 }));
        };
        // sort paginate search  filter
        const products = await Product.find({ ...req.query }, { name: 1, price: 1 })
        .sort(sort).paginate(page).search(keyword);

        return res.json({
            sucess: true,

            products
        })
    }
)
