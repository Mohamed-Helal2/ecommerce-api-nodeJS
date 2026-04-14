 import { Schema, model, Types } from "mongoose";

const subcategorySchema = Schema({
    name: { type: String, required: true, unique: true,min:5 , max:20,trim:true },
    slug:{type:String,required:true,unique:true,lowercase:true},
    createdBy :{type:Types.ObjectId,ref:'User',required:true},
    image: {id:{type:String}, url :{type:String}},
    category :{type:Types.ObjectId,ref:'Category',required:true},
     brands:[{type:Types.ObjectId,ref:"Brand"}]
}, { timestamps: true })

export const SubCategory = model('SubCategory', subcategorySchema)