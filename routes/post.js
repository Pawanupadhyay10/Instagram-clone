const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requirelogin=require('../middleware/requirelogin');
const Post=mongoose.model("Post")


router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err => {
            console.log(err)
        })
})

router.post('/createpost',requirelogin,(req,res)=>{
    const { title,body,pic} = req.body
    if(!title || !body|| !pic){
        return res.status(422).json({ error: "PLs add all field" })
    }
   // req.user.passward=undefined
    const post = new Post({
        title, 
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result => {
            res.json({ post:result })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/mypost',requirelogin,(res,req)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
        .then(myposts => {
            res.json({ myposts })
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports=router