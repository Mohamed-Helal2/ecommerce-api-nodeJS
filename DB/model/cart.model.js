import { Schema, model, Types } from "mongoose";

const cartSchema = Schema({
    user: { type: Types.ObjectId, ref: "User", required: true,unique:true },
    products: [{
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 }
    },

    ]

}, {
    timestamps: true
})

export const Cart = model('Cart', cartSchema)