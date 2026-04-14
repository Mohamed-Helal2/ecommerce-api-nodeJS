import Joi from "joi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const emailField = Joi.string()
  .email()
  .required()
  .messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid email format"
  });

const passwordField = Joi.string()
  .pattern(passwordRegex)
  .required()
  .messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number and be at least 8 characters long"
  });


  export const signupSchema = Joi.object({
  userName: Joi.string()
    .min(5)
    .max(25)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 5 characters",
      "string.max": "Name must not exceed 25 characters"
    }),
  email: emailField,
  password: passwordField,
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Confirm password is required",
      "any.only": "Confirm password must match password"
    }),
    role : Joi.string().valid('admin','user','seller').messages({
        "any.only": "Role must be either 'admin', 'user', or 'seller'"
    })  ,
    phone :Joi.string().messages({"string.base":"phone must be string"})
});


export const loginSchema = Joi.object({
  email: emailField,
  password: passwordField,
});


export const activatationSchema=Joi.object({
  token:Joi.string().required()
}).required()

export const forgetCodeSchema=Joi.object({
    email: emailField,
}).required()

export const resetPasswordSchema=Joi.object({
   email: emailField,
   code :Joi.string().length(5).required(),
   password: passwordField,
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Confirm password is required",
      "any.only": "Confirm password must match password"
    }),
}).required()


export const activateAccountSchema= Joi.object({
    token:Joi.string().required()
}).required()

 