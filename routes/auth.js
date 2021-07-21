const express = require('express')
const router = express.Router()
const crypto=require('crypto')
const bycrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model("User");
const {JWT_SECRET}=require('../config/keys');
const requirelogin=require('../middleware/requirelogin')
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL}= require('../config/keys')
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))
//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
//const sgMail=require("@sendgrid/mail")
//api_key=SENDGRID_API


router.get('/', (req, res) =>{
    res.send("hello world!!!")
});
router.post('/signup', (req, res) => {
    const { name, email, passward, pic} = req.body
    if (!email || !passward || !name) {
        return res.status(422).json({ error: "PLs add all field" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "error exist with different fields" })
            }
            bycrypt.hash(passward, 12)
                .then(hashedpassward => {
                    const user = new User({                    
                        email, 
                        passward:hashedpassward,name,pic
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                    to:user.email,
                                    from:"money148001@gmail.com",
                                    subject:"signup success",
                                    html:"<h1>welcome to instagram</h1>"
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

router.post('/signin', (req, res) => {
    const { email, passward } = req.body
    if (!email || !passward) {
        return res.status(422).json({ error: "PLs add email and passward field" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "error exist with different fields" })
            }
            bycrypt.compare(passward,savedUser.passward)
                .then(doMatch => {
                    if(doMatch){
                            // res.json({ msg: "saved successfully" })
                            const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
                            const { _id,name,email,followers,following,pic}=savedUser
                            res.json({ token, user: { _id,  name,email,followers,following,pic}})
                    }
                    else{
                return res.status(422).json({ error: "invalid fields" })
                    }
                })
        
        .catch(err => {
            console.log(err)
    
        })
    })
});

router.post('/reset-passward',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{//created token of size 32
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
            transporter.sendMail({
             to:user.email,
              from:"Pawandev1099@gmail.com",
              subject:"password reset",
              html:`
              <p>You requested for password reset</p>
              
              <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
              `
                //<a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5> 
               
                })
            res.json({message:"check your email"})
           })
            .catch((err)=>{
                console.error(err)
            })

        })

   })
});


router.post('/new-passward',(req,res)=>{
   const newPassward = req.body.passward
   const sentToken = req.body.token
   User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
   .then(user=>{
       if(!user){
           return res.status(422).json({error:"Try again session expired"})
       }
       bcrypt.hash(newPassward,12).then(hashedpassword=>{
          user.passward = hashedpassward//spelling
          user.resetToken = undefined
          user.expireToken = undefined
          user.save().then((saveduser)=>{
              res.json({message:"password updated successfully"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
});


module.exports = router
