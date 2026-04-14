import multer, { diskStorage } from "multer"
export const fileValidation = {
    images: ['png', 'jpeg', 'jpg','JPG','PNG'],
    files: ['pdf']
}
export const fileUpload = () => {
    const fileFilter = (req, file, cb) => {
        if (fileValidation.images.includes(file.originalname.split('.').pop().toLowerCase())) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
    return multer({ storage: diskStorage({}), fileFilter });

}