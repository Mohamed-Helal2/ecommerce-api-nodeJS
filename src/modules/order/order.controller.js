import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../../../DB/model/order.model.js";
import { Coupon } from "../../../DB/model/coupon.model.js";
import { Product } from "../../../DB/model/product.model.js";
import { Cart } from "../../../DB/model/cart.model.js";
import createInvoice from "../../utils/pdfinvoice.js";
import cloudinary from "../../utils/cloud.js";
import path from "path";
import { fileURLToPath } from "url";
import {SendEmail} from "../../utils/sendEmail.js";
import { updateStock } from "./order.service.js";
import { clearCart } from "./order.service.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // order folder

export const createOrder = asyncHandler(
    async (req, res, next) => {
        const { payment, address, coupon, phone } = req.body;
        // check coupon
        let checkCoupon;
        if (coupon) {
            checkCoupon = await Coupon.findOne({ name: coupon });
        }
        if (!checkCoupon) return next(new Error('invalid coupon', { cause: 400 }));
        console.log(req.user.id);

        // get products from cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return next(new Error('cart not Exist'));
        const products = cart.products;
        if (products.length < 1) return next(new Error('Empty cart'));
        //check products
        let orderProducts = []; // [{},{},{}]
        let orderPrice = 0;
        for (let i = 0; i < products.length; i++) {
            const pro = products[i];
            const product = await Product.findById(pro.productId);
            if (!product) return next(new Error(`${pro.productId} Not Found`));
            // check stock
            if (!product.isInStock(pro.quantity)) return next(new Error(`product not in stock, availabe Items  is ${product.avaliableItems}`));

            orderProducts.push({
                productId: pro.productId,
                name: product.name,
                quantity: pro.quantity,

                itemPrice: product.finalPrice,
                totalPrice: product.finalPrice * pro.quantity
            });
            orderPrice += (product.finalPrice * pro.quantity)
        }
        // create order in DB
        const order = await Order.create({
            userId: req.user._id,
            products: orderProducts,
            address: address,
            payment: payment,
            phone: phone,
            price: orderPrice,
            coupon: {
                id: checkCoupon?._id,
                name: checkCoupon?.name,
                discount: checkCoupon?.discount
            }
        });
        // generate invoice
        const invoice = {
            shipping: {
                name: req.user.userName,
                address: address,
                country: "EGYPT"
            },
            items: orderProducts,
            subtotal: orderPrice,  // before discount
            paid: order.finalPrice,
            invoice_nr: order._id
        };
       // const pdfPath = path.join(__dirname, `../../../src/tempInvoices/${order._id}.pdf`);
       const pdfPath=`D:/3-Node/Root/E-commerce/invoices/${order._id}.pdf`
      await  createInvoice(invoice, pdfPath);
        // upload invoice to DB
        const { secure_url, id } = await cloudinary.uploader.upload(`${pdfPath}`, {
            folder: `${process.env.CLOUD_FOLDER_NAME}/orders/invoices`
        });
        // add invoice to DB file
        order.invoice = {
            url: secure_url,
            public_id: id
        }
        await order.save();
        // send invoice to email
        // const isSent=  await  SendEmail({
        //     to:req.user.email,
        //     subject:"your order invoice",
        //     attachments: [{
        //         // path:{secure_url},
        //         // contentType: 'application/pdf',
        //           path: pdfPath,
        //           filename: `${order._id}.pdf`
        //     }]
        // });
        const isSent = await SendEmail({
    to: req.user.email,
    subject: "your order invoice",
    attachments: [{
        path: secure_url, // Pass the string directly, not an object
        contentType: 'application/pdf',
        filename: `invoice_${order._id}.pdf`
    }]
});
        if(!isSent) return next(new Error("failed to send email"));
        // update stock
        await updateStock(products);
        // clear cart
        await clearCart(req.user.id);
        // send response
        return res.json({
            success: true,
            message: "added order successfully",
            //test: order.finalPrice,
             order
        })
    }
);

export const cancelOrder = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id, userId: req.user.id });
        if (!order) return next(new Error('order not found', { cause: 404 }));
        if (order.status === "canceled") return next(new Error('order already canceled', { cause: 400 }));
        if(order.status === "delivered") return next(new Error('order already delivered, can not be canceled', { cause: 400 }));
        order.status = "canceled";
        await order.save();
        // return stock
        await updateStock(order.products.map(pro => {
            return {
                productId: pro.productId,
                quantity: -pro.quantity
            }
        }));
        return res.json({
            success: true,
            message: "order canceled successfully",
            order
        })
    });