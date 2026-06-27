const session=require("express-session");
require("dotenv").config()
const sessionMildleWare=session({
    secret:"your-secret-key",
    resave:false,
    saveUninitialized:true
})
module.exports=sessionMildleWare