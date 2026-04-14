// import multer ,{diskStorage} from "multer";
// import { nanoid } from 'nanoid'
//  // disk Storage
// export const fileValidation ={
//   images:['png','jpeg','jpg'], 
//   files :['pdf']
// }
// export function uploadFile({folder}){
//     const storage = diskStorage({
//   destination: `uploads/${folder}`,
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     console.log(file);
//     console.log(uniqueSuffix);
//     cb(null, nanoid() + "__"+file.originalname)   // rename file -> save file -> call next() to controller
//   }
// })
//   const fileFilter= (req,file,cb)=>{
// //  const allowedExtensions = /jpeg|jpg|png|pdf/;
//     // const extname = allowedExtensions.test(file.originalname.toLowerCase());
//     // const mimetype = allowedExtensions.test(file.mimetype);
//     if(fileValidation.images.includes(file.originalname.split('.').pop().toLowerCase())){
   
//         return cb(null,true);      }else{
//         cb(new Error('Only images are allowed'),false);
//       }
//     // if (extname && mimetype) {
//     //     return cb(null, true);
//     // } else {
//     //     cb(new Error('Only images are allowed'),false);
//     // }
//   }
// const multerUpload = multer({ storage: storage,fileFilter:fileFilter});
// return multerUpload;
// }
