import { asyncHandler } from "../../utils/asyncHandler.js";
import { Coupon } from "../../../DB/model/coupon.model.js";
import voucher_codes from 'voucher-code-generator'
import { User } from "../../../DB/model/user.model.js";
export const createCoupon = asyncHandler(
    async (req, res, next) => {
        //genereta code
        const code = voucher_codes.generate({
            length: 5,

        })[0];
        console.log(Date.now());
        console.log(req.body.expiredAt);


        // save code in DB
        const coupon = await Coupon.create({
            name: code,
            discount: req.body.discount,
            expiredAt: new Date(req.body.expiredAt).getTime(),
            createdBy: req.user._id
        })
        // send response
        return res.status(201).json({
            sucess: true,
            messgae: "created Coupon Sucessfully",
            coupon
        })
    }
)


export const updateCoupon = asyncHandler(
    async (req, res, next) => {
        // check coupon
        const { code } = req.params;        
        const coupon = await Coupon.findOne({
            name: code,
             expiredAt: { $gt: Date.now() },
        });
        if (!coupon) return next(new Error('this coupon not valid'));
        // check owner
        const isOwner = coupon.createdBy.toString() === req.user.id;
        if (!isOwner) return next(new Error('this is not owner of this coupon', { cause: 403 }));
        // update Coupon
        
        if (req.body?.discount) coupon.discount = req.body.discount;
         if (req.body?.expiredAt) coupon.expiredAt = new Date(req.body.expiredAt).getTime();
        await coupon.save();
        // await Coupon.findOne({ createdBy: req.user._id });
        return res.json({
            sucess: true,
            messahe: "update coupon sucessfully"
        })
    }
)

export const deleteCoupon=asyncHandler(
    async(req,res,next)=>{
         const { code } = req.params;        
        const coupon = await Coupon.findOne({
            name: code,
            // expiredAt: { $gt: Date.now() },
        });
        if (!coupon) return next(new Error('this coupon not valid'));
        // check owner
        const isOwner = coupon.createdBy.toString() === req.user.id;
        if (!isOwner) return next(new Error('this is not owner of this coupon', { cause: 403 }));
        await coupon.deleteOne();
        // await Coupon.findByIdAndDelete(coupon.id);
        return res.json({
            sucess:true,
            message:"deleted Coupon Sucessfuly"
        })
    }
)

export const getAllCoupon = asyncHandler(
    async(req,res,next)=>{
          const role=req.user.role;
          let coupons;
        // admin
        if(role ==='admin'){
             coupons=await Coupon.find({},{name:1,discount:1,_id:0});
        }
        // seller
        else{
            coupons=await Coupon.find({
                createdBy:req.user.id
            },{name:1,discount:1,_id:0});
        }
        // seller
         
        return res.json({
            sucess:true,
            message:"all Coupon",
            coupons
        })
    }
)