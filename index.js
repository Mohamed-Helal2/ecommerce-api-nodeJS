 import express from 'express';
 import { connectionDB } from './DB/connection.js';
 import dotenv from 'dotenv';
 import  {authRouter}  from './src/modules/auth/auth.router.js';
 import { categoryRouter } from './src/modules/category/category.router.js';
 import { subCategoryRouter } from './src/modules/subcategory/subCategory.router.js';
import { brandRouter } from './src/modules/brand/brand.router.js';
import { couponRouter } from './src/modules/coupon/coupon.router.js';
import { productRouter } from './src/modules/product/product.router.js';
import { cartRouter } from './src/modules/cart/cart.router.js';
import { orderRouter } from './src/modules/order/order.router.js';
import { reviewRouter } from './src/modules/review/review.router.js';
import createInvoice from './src/utils/pdfinvoice.js';
import morgan from 'morgan';
 import cors from 'cors';

 const app = express();
dotenv.config();

// middleware for parsing
app.use(express.json());

// connect DataBase
await connectionDB();
// Cors
// const whitelist = ['http://127.0.0.1:5500'];
// app.use((req, res, next) => {
//    console.log("------------------- ");
   
//    const origin = req.header('origin');

//    console.log(origin);
//    if(!whitelist.includes(origin)){
//       return next(new Error('Origin not allowed'));
//    }
//    res.setHeader('Access-Control-Allow-Origin', "*");
//    res.setHeader('Access-Control-Allow-Headers', "*");
//    res.setHeader('Access-Control-Allow-Methods', "*");
//    res.setHeader('Access-Control-Private-Network', true);
//    return next();
// });

const whitelist = ['http://127.0.0.1:5500'];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
      if(  req.originalUrl.includes('/success') || req.originalUrl.includes('/cancel') || req.originalUrl.includes('/auth/activate-account') ){
        return callback(null, true);
      }
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "token"], // Add your custom headers here
    credentials: true
};

app.use(cors(corsOptions));

//
app.use(morgan('combined'));
//   await createInvoice(invoice, "invoice.pdf");
// router
app.use("/auth",authRouter);
app.use("/category",categoryRouter);
app.use("/subcategory",subCategoryRouter);
app.use('/brand',brandRouter);
app.use('/coupon',couponRouter);
app.use('/product',productRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
// app.use('/review',reviewRouter);

// pagr not found handler 
app.use((req,res,next)=>{
    return  res.status(404).json({
        success:false,
        message:"Invalid end point"
    })
    //  next(new Error('invalid end point s'))
   
})
// global eror rhandler
app.use((error,req,res,next)=>{
   const statusCode=error.cause || 500;
   return res.status(statusCode).json({
      sucess:false,
      message:error.message,
      stack:error.stack
   })
})

 app.listen(process.env.PORT, 
    () => console.log(`Example app listening on port ${process.env.PORT}!`))