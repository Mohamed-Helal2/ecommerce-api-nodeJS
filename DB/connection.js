import mongoose from "mongoose"


export const connectionDB = async()=>{
    return await mongoose.connect(process.env.CONNECTION_URL).then(()=>{
        console.log("connected to DB Sucessfully");
        
    }).catch((err)=>{
        console.log("error for conenctin in DB ",err);
        
    })
}