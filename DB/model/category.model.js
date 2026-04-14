import { Schema, model, Types } from "mongoose";
import { SubCategory } from "./subCategory.model.js";
const categorySchema = Schema({
    name: { type: String, required: true, unique: true, min: 5, max: 20, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    image: { id: { type: String }, url: { type: String } },
    brands:[{type:Types.ObjectId,ref:"Brand"}]
}, { timestamps: true,
    toJSON:{virtuals:true},toObject:{virtuals:true} })


// not save in database
categorySchema.virtual("subcategory",{
    ref :"SubCategory" ,
    localField : "_id" ,
    foreignField : "category"
});
categorySchema.post("deleteOne",{document:true,query:false},async function(){
    await SubCategory.deleteMany({
        category:this._id
    })
});
// categorySchema.virtual('testName').get(function(){
// return this.name+'77'
// });
export const Category = model('Category', categorySchema)