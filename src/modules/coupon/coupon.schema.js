import Joi from "joi";

export const createCouponSchema = Joi.object({
    discount: Joi.number().integer().min(1).max(100).required(),
    expiredAt: Joi.string().required().custom((value, helpers) => {
        // 1. Split the "9/5/2026" string
        const [day, month, year] = value.split('/').map(Number);

        // 2. Create a Date (Note: Month is 0-indexed, so we do month - 1)
        const dateObject = new Date(year, month - 1, day);

        // 3. Validation: Check if the date is actually valid (e.g., not 31/02)
        if (dateObject.getFullYear() !== year || dateObject.getMonth() !== month - 1) {
            return helpers.message("Invalid calendar date");
        }

        // 4. Validation: Check if it's in the future
        if (dateObject.getTime() <= Date.now()) {
            return helpers.message("expiredAt must be a future date");
        }
        return dateObject.getTime();
    }),
}).required();

export const updateCouponSchema = Joi.object({
    discount: Joi.number().integer().min(1).max(100),
    expiredAt: Joi.string().custom((value, helpers) => {
        const [day, month, year] = value.split('/').map(Number);
        // 2. Create a Date (Note: Month is 0-indexed, so we do month - 1)
        const dateObject = new Date(year, month - 1, day);
        // 3. Validation: Check if the date is actually valid (e.g., not 31/02)
        if (dateObject.getFullYear() !== year || dateObject.getMonth() !== month - 1) {
            return helpers.message("Invalid calendar date");
        }
        // 4. Validation: Check if it's in the future
        if (dateObject.getTime() <= Date.now()) {
            return helpers.message("expiredAt must be a future date");
        }
        return dateObject.getTime();
    }),
    code: Joi.string().length(5).required()
})


export const deleteCouponSchema = Joi.object({
    code: Joi.string().length(5).required()
}).required();

