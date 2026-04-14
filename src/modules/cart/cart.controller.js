import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../../DB/model/cart.model.js";
import { Product } from "../../../DB/model/product.model.js";
export const addToCart = asyncHandler(
    async (req, res, next) => {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
         
        // check stock
        const product = await Product.findById(productId);
        if(!product) return next(new Error('Product not found'));

        if(!product.isInStock(quantity)) return next(new Error('available items not suitable'));
        // check product id is in cart
        const existingCartItem = await Cart.findOne({ user: userId, "products.productId": productId });
        if (existingCartItem) {
            // add more qunatity to existing item
            const updatedCart = await Cart.findOneAndUpdate(
                { user: userId, "products.productId": productId },
                { $inc: { "products.$.quantity": quantity } },
                { new: true }
            );
            return res.json({
                sucess: true,
                message: "Quantity updated successfully",
                cart: updatedCart
            });
        };
        const cart = await Cart.findOneAndUpdate({
            user: userId,
        }, { $push: { products: { productId, quantity } } }, { new: true })
        return res.json({
            sucess: true,
            message: "added to cart sucessfully",
            cart
        })
    }
)

export const getUserCart = asyncHandler(
    async (req, res, next) => {
        if (req.user.role == 'user') {
            const cart = await Cart.findOne({ user: req.user._id });
            return res.json({
                sucess: true,
                cart
            })
        }
        if (req.user.role === 'admin' && !req.body.cartId) return next(new Error('cartId is required'));
        const cart = await Cart.findOne({ user: req.body.cartId });
        return res.json({
            sucess: true,
            cart
        })
    }
);

export const updateCart = asyncHandler(
    async (req, res, next) => {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return next(new Error('product not Exist'));
        // check stock
        const isInStock = quantity <= product.avaliableItems;
        if (!isInStock) return next(new Error('this product is not in stock'));
        const cart = await Cart.findOneAndUpdate({ user: req.user._id, "products.productId": productId },

            { "products.$.quantity": quantity }, { new: true }
        );
        return res.json({
            sucess: true,
            message: 'update cart sucessfully',
            cart
        });
    }
);


// remove item from cart

export const removeItemFromCart = asyncHandler(
    async (req, res, next) => {
        const { productId } = req.body;

        await Cart.findOneAndUpdate({ user: req.user._id },
             { $pull: { products: { productId } } });
        // await Cart.updateMany({ user: req.user._id }, { $pull: { products: productId } });
        return res.json({
            sucess: true,
            message: 'remove item from cart'
        });
    }
)


// clear cart
export const clearCart = asyncHandler(
    async (req, res, next) => {
        const userId = req.user._id;

        await Cart.findOneAndUpdate({ user: userId }, { products: [] });
        return res.json({
            sucess: true,
            message: 'clear cart'
        });
    }
);