import { User } from "../../../DB/model/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { SendEmail } from "../../utils/sendEmail.js";
import  jwt  from "jsonwebtoken";
import { confirmEmailTemplate } from "../../utils/emailTemplates/confirmEmail.template.js";
import {activationSuccessTemplate,activationFailedTemplate,activationUserNotFoundTemplate} from "../../utils/emailTemplates/activation.template.js";
import { forgetPasswordTemplate } from "../../utils/emailTemplates/forgetPassword.template.js";
import { Token } from '../../../DB/model/token.model.js';
import randomstring  from "randomstring";
import { Cart } from "../../../DB/model/cart.model.js";
export const SignUp = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, gender, phone, role, profileImage, coverImages } = req.body
        // search by email
        const isEmailExist =await User.findOne({ email: email });
        if (isEmailExist) return next(new Error('this  email is Exist',{cause:409}));

        // hash password
        // const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));

        // create user
        const user = await User.create({ ...req.body
            //, password: hashedPassword 
        });

        // generate token 
        const token = await jwt.sign({ email: email }, process.env.TOKEN_SECRET_KEY);

        // send confirm email
        const messageSent = await SendEmail({
            to: email,
            subject: "Ecommerce Account Activation ",
            html: confirmEmailTemplate(token)
     });
     if(!messageSent) return next(new Error('this email is in correct',{cause:400}));

     // send response
        return res.status(201).json({
            message: "Go To Your Account And Acivate it",
           user
        })
    }
)

 export const ConfirmEmail = asyncHandler(async (req, res,next) => {
    const { token } = req.params;
    let payload;
    try {
        payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    } catch (err) {
        return res.status(400).send(
            activationFailedTemplate()
        );
    }
    const email = payload.email;
    const user = await User.findOneAndUpdate(
        { email },
        { isConfirmed: true },
        { new: true } // correct mongoose option
    );
    if (!user) {
        return res.status(404).send(
            activationUserNotFoundTemplate()
        );
    }
    await Cart.create({
        user:user._id
    })
    // create TODO
    return res.send(
        activationSuccessTemplate(email)
    );
});


export const Login =asyncHandler(
    async(req,res,next)=>{
        const {email,password}=req.body;
        // check email to user
        const user=await User.findOne({email});
        if(!user) return next(new Error('invalid email',{cause:404}));
        // check password
        const matchHashPassword = await bcrypt.compare(password, user.password);
        if (!matchHashPassword) return next(new Error('password is incorret', { cause: 400 }));
        // check confirmed or not 
        const isConfirmedEmail=user.isConfirmed;
        if(!isConfirmedEmail) return next(new Error('u should activate your account',{cause:400}));
        // generate token 
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET_KEY);
        // saved token in DB
        await Token.create({ token, user: user.id, agent: req.headers['user-agent'] });
        // if true login
        return res.json({
            message:'login Sucessfully',
             token,
        })
    }
)

// send code - forget password
export const forgetPassword= asyncHandler(
    async(req,res,next)=>{
        const {email}=req.body;
        // check email to user
        const user= await User.findOne({email});
          if(!user) return next(new Error('invalid email',{cause:404}));
          // check activation
           const isConfirmedEmail=user.isConfirmed;
        if(!isConfirmedEmail) return next(new Error('u should activate your account',{cause:400}));
        // generate code
         const code=randomstring.generate({
            length:5,
            charset:'numeric'
        });
        // save code in db
        user.forgetCode=code;
        user.save();
        // send email with code
        const messageSent= await SendEmail(
           { to:email ,
            subject:"Password Reset Code",
            html:forgetPasswordTemplate(code)
            }
        )
       if (!messageSent) return next(new Error("this email is in correct", { cause: 400 }));
        return res.json({
            sucess:true,
            messgae:'check your email'
        })
    }
);

export const ResetPassword=asyncHandler(
   async (req,res,next)=>{
    const {email,password,code}=req.body
    // check email
    const user=await User.findOne({email});
    if(!user) return next(new Error('this user not exist'));
    // check code
    if(code !== user.forgetCode) return next(new Error('code is Wrong'));
    // hash password
    const hashedPassword=  bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND));
    user.password=hashedPassword;
    user.save();
    // remove all token 
     let tokens=await Token.find({user:user._id});
    tokens.forEach(async(token)=>{
        token.isValid=false;
        await token.save();
    })
    // response
    return res.json({
        message:'reset password sucessfully'
    })
    }
)
