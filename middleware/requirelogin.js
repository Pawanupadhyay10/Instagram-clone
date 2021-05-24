const jwt=require("jsonwebtoken")
const { JWT_SECRET } = require('../keys');
const mongoose = require('mongoose')
const User = mongoose.model("User");

module.exports=(req,res,next)=>{
   const{auth}=req.headers
   if(!auth){
      return res.status(401).json({error:"you must be loged in"})
   }
   const token=auth.replace("Bearer","")
   jwt.verify(token,JWT_SECRET,(err,payload)=>{
       if(err){
           return res.status(401).json({ error: "you must be loged in" })
       }
       const{_id}=payload
       User.findById(_id).then(userdata=>{
           req.user=userdata
       })
       next()
   })
}