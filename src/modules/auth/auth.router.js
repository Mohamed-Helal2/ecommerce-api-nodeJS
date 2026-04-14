import { Router } from "express";
import  * as AC  from "./auth.controller.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import * as SC     from "./auth.schema.js";
export  const   authRouter=  Router();

// signup
authRouter.post('/signup',validationMiddleware(SC.signupSchema),AC.SignUp);

// confirm email
authRouter.get('/confirmEmail/:token',validationMiddleware(SC.activatationSchema),AC.ConfirmEmail);

// login
authRouter.post('/login',validationMiddleware(SC.loginSchema),AC.Login)
// forget passwor and send code
authRouter.patch('/forget-password',validationMiddleware(SC.forgetCodeSchema),AC.forgetPassword);
// reset password
authRouter.patch('/reset-password',validationMiddleware(SC.resetPasswordSchema),AC.ResetPassword);




