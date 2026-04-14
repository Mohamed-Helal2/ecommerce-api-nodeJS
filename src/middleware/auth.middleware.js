import { Token } from "../../DB/model/token.model.js";
import { User } from "../../DB/model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
export const authnticatedMiddleware =
    asyncHandler(
        async (req, res, next) => {
            const { token } = req.headers;
            // check token existance
            if (!token) return next(new Error('token missing', {
                cause: 400
            }));
            // check prefix 
            if (!token.startsWith(process.env.BEARER_KEY))
                return next(new Error("Invalid Token is false", { cause: 401 }));
            // verify token
            const trueToken = token.split(process.env.BEARER_KEY)[1];
            // check token is valid or not 
            const tokenDB = await Token.findOne({ token: trueToken, isValid: true });
            if (!tokenDB) return next(new Error("token expired in DB", { cause: 400 }));
            // extract data from DB
            const payload = jwt.verify(trueToken, process.env.TOKEN_SECRET_KEY);
            // CHECK USER EXISTANCE
            const isUser = await User.findById(payload.id);
            if (!isUser) return next(new Error("user not found", { cause: 404 }));
            if (!isUser.isConfirmed) return next(new Error("this email not confirmed"));
            // pass user to controller 
            req.user = isUser; // 
            return next();
        }

    )