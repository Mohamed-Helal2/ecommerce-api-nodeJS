import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    userName: { type: String, required: true, min: 5, mx: 25 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    gender: { type: String, enum: ['female', 'male'] },
    phone: { type: String },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    forgetCode: { type: String },
    profileImage: {
        url: { type: String, default: 'https://res.cloudinary.com/dp9d0ti9d/image/upload/v1773326760/profilePic_vmdejz.png' }, id: {
            type: String,
            default: 'profilePic_vmdejz'
        }
    },
    coverImages: [{ url: { type: String }, id: { type: String } }]
}, {
    timestamps: true
});

userSchema.pre('save', function () {
    if (this.isModified("password")) {
        const hashedPassword = bcrypt.hashSync(this.password, parseInt(process.env.SALT_ROUND));
        this.password = hashedPassword;
    }
})
export const User = model('User', userSchema)