 import { Schema, model,Types } from "mongoose";
const brandSchema = new Schema({
    name: { type: String, unique: true, min: 2, max: 12, required: true },
     slug: { type: String, required: true, unique: true },
    image: {
         id: { type: String, required: true },
        url: { type: String, required: true }
       
    },
     createdBy:{type:Types.ObjectId,ref:"User",required:true}
 
}, {
    timestamps: true
});

export const Brand = model('Brand', brandSchema);