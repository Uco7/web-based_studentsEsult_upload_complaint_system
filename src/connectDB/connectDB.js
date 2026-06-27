require ("dotenv").config()


const mongoose=require("mongoose")
const connectDB=async()=>{
    try {
        
        const connection=mongoose.connect(process.env.MONGODB_URI)
        if (connection) {
            console.log("db connected successfully");
            
        } else {
            console.log("db not connected");
            
        }
    } catch (error) {
        console.log(error)
        
    }
    
}
module.exports=connectDB
