import { Schema, Types, model } from "mongoose";
const productSchema = new Schema({
    name: { type: String, required: true, min: 2, max: 20 },
    description: { type: String, min: 10, max: 200 },
    images: [{
        id: { type: String, required: true },
        url: { type: String, required: true }
    }],
    defaultImage: {
        id: { type: String, required: true },
        url: { type: String, required: true }
    },
    avaliableItems: { type: Number, required: true, min: 1 },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, required: true, unique: true },
    averageRate:{type:Number,min:1,max:5}
}, {
    timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true },strictQuery :true
});

productSchema.virtual('finalPrice').get(function () {
    if (this.discount) {
        return this.price - (this.price * this.discount / 100);
    } else {
        return this.price;
    }
   // return Number.parseFloat(this.price.toFixed(this.price * this.discount || 0)/100).toFixed(2);
});

// query helper for paginate
productSchema.query.paginate= function(page){
    // this -> query
        page  = page<1  || isNaN(page) || !page ? 1 :page
        const limit = 2;
        const skip = limit * (page -1)   ;
        return this.skip(skip).limit(limit);
 };
// query helper for search
productSchema.query.search=function (keyword){
    // const keyworks=!keyword || isNaN(KE).
    if(keyword){
        return this.find({$or: [
            {name: { $regex : keyword , $options :"i"}},
           // {description: { $regex : keyword , $options :"i"}}
        ]});
    }
        return this;
      
}

// method
productSchema.methods.isInStock=function(requiredQuantity){
    // this -> document
    return this.avaliableItems >= requiredQuantity? true :false;

}

productSchema.virtual('review',{
    ref:'Review',
    localField:"_id",
    foreignField:'productId',
})


export const Product = model('Product', productSchema);