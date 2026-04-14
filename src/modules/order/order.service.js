import { Product } from "../../../DB/model/product.model.js";
import { Cart } from "../../../DB/model/cart.model.js";
export const updateStock = async (products) => {
    for (let i = 0; i < products.length; i++) {
        const pro = products[i];
        const product = await Product.findByIdAndUpdate(pro.productId, {
            $inc: {
                avaliableItems: -pro.quantity,
                soldItems: pro.quantity
            }
        });
        await product.save();
    }
}

// clear cart
export const clearCart = async (userId) => {
    await Cart.findOneAndUpdate({ user: userId }, { products: [] });

}