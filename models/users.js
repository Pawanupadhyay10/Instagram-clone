const mongoose = require('mongoose')
const{ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{ type: String, required: true},
    passward:{ type: String, required: true },
    resetToken:String,
    expireToken:Date,
    pic: { type: String, default:"https://res.cloudinary.com/panni/image/upload/v1623070972/xxh4wlncptii37zczbap.webp"},
    followers:[{type:ObjectId,ref:"User"}],
    following: [{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)