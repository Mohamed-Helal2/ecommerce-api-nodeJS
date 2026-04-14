import { Product } from "../../../DB/model/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../../../DB/model/order.model.js";
import { Review } from "../../../DB/model/review.model.js";
export const addReview= asyncHandler(
    async(req,res,next)=>{
         const {productId}=req.params;
        const {comment,rating} = req.body;

        // check product in order

        const order = await Order.findOne({
            userId:req.user._id,
            status:"delivered",
            "products.productId":productId
        })
        if(!order) return next(new Error('you can not add review for this product',{cause:400}));
        // check past reviews
        // const hasReviewed = await Product.findOne({
        //     _id:productId,
        //     "reviews.createdBy":req.user._id
        // })
        // if(hasReviewed) return next(new Error('you have already reviewed this product',{cause:400}));

        // // create review
        const review = await Review.create({
            rating,
            comment,
             createdBy: req.user._id,
             orderId:order._id,
             productId:productId
        });
        // clculate average rating
        let clacRating=0;
        const product = await Product.findById(productId);
        const reviews=await Review.find({productId:productId});
        reviews.forEach(review=>{
            clacRating+=review.rating;
        })
        const averageRating=clacRating/reviews.length;
        product.rating=averageRating;
        await product.save();
         // CHECK 
        return res.json({
            sucess:true,
            message:"added review sucesssfully",
            averageRating
        })
    }
);

export const updateReview= asyncHandler(
    async(req,res,next)=>{
        const {id,productId}=req.params;
        const {comment,rating} = req.body;
        const review = await Review.findOneAndUpdate({_id:id,createdBy:req.user._id}, {comment,rating}, {new:true});
        if(!review) return next(new Error('review not found',{cause:404}));
        // clculate average rating
        let clacRating=0;
        const product = await Product.findById(review.productId);
        const reviews=await Review.find({productId:review.productId});
        reviews.forEach(review=>{
            clacRating+=review.rating;
        })
        const averageRating=clacRating/reviews.length;
        product.rating=averageRating;
        await product.save();
         // CHECK 
        return res.json({
            sucess:true,
            message:"updated review sucesssfully",
            averageRating
        })});