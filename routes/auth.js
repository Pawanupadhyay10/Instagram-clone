const express = require('express');
const router = express.Router();
const crypto=require('crypto')
const bycrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model("User");
const {JWT_SECRET}=require('../config/keys');
const requirelogin=require('../middleware/requirelogin')
const nodemailer=requirelogin('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL}= require('../config/keys')
const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

//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
router.post('/signup', (req, res) => {
    const { name, email, passward, pic} = req.body
    if (!email || !passward || !name) {
        return res.status(422).json({ error: "PLs add all field" })
    }
    User.findOne({ email: email })
        .then((saveduser) => {
            if (saveduser) {
                return res.status(422).json({ error: "error exist with different fields" })
            }
            bycrypt.hash(passward, 12)
                .then(haspassward => {
                    const user = new User({                    
                        email, passward:haspassward,name,pic
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to:user.email,
                                from:"no-reply@insta.com",
                                subject:"singup success",
                                html:"<h1>Welcome to instagram</h1>"
                            })
                            res.json({ msg: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
});

router.post('/login', (req, res) => {
    const { email, passward } = req.body
    if (!email || !passward) {
        return res.status(422).json({ error: "PLs add email and passward field" })
    }
    User.findOne({ email: email })
        .then((saveduser) => {
            if (!saveduser) {
                return res.status(422).json({ error: "error exist with different fields" })
            }
            bycrypt.compare(passward,saveduser.passward)
                .then(doMatch => {
                    if(doMatch){
                            // res.json({ msg: "saved successfully" })
                            const token =jwt.sign({_id:saveduser._id},JWT_SECRET)
                            const { _id,email, name,followers,following,pic}=saveduser
                        res.json({ token, user: { _id, email, name,followers, following,pic}})
                    }
                    else{
                return res.status(422).json({ error: "invalid fields" })
                    }
                })
        })
        .catch(err => {
            console.log(err)
        })
});

router.post('/reset-passward',(res,req)=>{
   crypto.randomBytes(32,(err,buffer)=>{
       if(err){
           console.log(err)
       }
       const token=buffer.toString("hex")
       User.findOne({email:req.body.email})
       .then(user=>{
           if(!user){
               return res.status(422).json({ error: "User don't exists with that email" })
           }
           user.resetToken=token
           user.expireToken=Date.now()+3600000
           user.save().then((result)=>{
               transporter.sendMail({
                   to:user.email,
                   from:"no-reply@insta.com",
                   subject:"password reset",
                   html:`<p>PLs reset Your Password</p>
                   <h5> click on password reset <a href="${EMAIL}/reset/${token}">link</a></h5>`
               })
               res.json({message:"check your email"})
           })
       })
   })
})

router.post('/new-password',(res,req)=>{
    const newpassword=req.body.passward
    const sentToken= req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now}})
    .then(user=>{
        if(!user){
            return res.status(422).json({ error: "Try again session expired" })
        }
        bycrypt.hash(newpassword,12).then(haspassward=>{
            res.passward=haspassward
            user.resetToken=undefined
            user.expireToken=undefined
            user.save.then((saveduser)=>{
                res.json({message:"Passward updated success"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })  
})
module.exports = router;