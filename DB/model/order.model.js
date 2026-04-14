import { Schema,Types,model } from "mongoose";

export const orderSchema= Schema({
    userId:{type:Types.ObjectId,ref:"User", required:true},
    products:[{
        productId:{type:Types.ObjectId,ref:"Product", required:true},
        quantity:{type:Number,min:1},
        name:String,
        itemPrice:Number,
        totalPrice:Number,
    }],
    address:{type:String,required:true},
    payment:{type:String,default:"cash",enum:["cash","visa"]},
    phone: {type:String,required:true},
    price:{type:Number,required:true},
    invoice:{url:String,id:String},
    coupon:{
        id:{type:Types.ObjectId,ref:"Coupon", required:true},
        name:{type:String},
        discount:{type:Number,min:1,max:100}
    },
    status:{type:String,default:"placed",enum:["placed","shipped",'deliverd','canceled','refunded']}
},{
    timestamps:true
});

orderSchema.virtual('finalPrice').get(function () {
    if (this.coupon && this.coupon.discount) {
        return this.price - (this.price * this.coupon.discount / 100);
    } else {
        return this.price;
    }
});

export const Order=model('Order',orderSchema);