const express = require("express")
const router=express.Router()
const mongoose = require("mongoose")
const requirelogin = require("../middleware/requirelogin")
const Post=mongoose.model("Post")

//for finding all the posts posted by the user 
router.get('/allpost',requirelogin, (req, res) => {
     Post.find()//finds all post
     .populate("postedBy","_id name")//expanding something is known as populate 
     .then(posts=>{//name of the database that we have created 
         res.json({posts})
     })
     .catch(err=>{
         console.log(err)
     })
})

//creating the post 
router.post('/createpost',requirelogin,(req,res)=>{
    const{title,body,pic}=req.body
    if(!title || !body||!pic){
        //console.log(error)
      return res.status(422).json({error:"Please add all the fields"})
}
//req.user.passward=undefined
const post = new Post({
    title,
    body,
    photo:pic,
    postedBy:req.user
})
post.save().then(result=>{
    res.json({post:result})
})
.catch(err=>{
    console.log(err)
 })
})

// we have to make this route so that we can view the profile of his /her
   router.get('/mypost',requirelogin,(req,res)=>{
     Post.find({postedBy:req.user._id})
     .populate("PostedBy","_id name")
     .then(mypost=>{
        res.json({mypost})
     })
     .catch(err=>{
        console.log(err)
     })
   })
   
   router .put('/like',requirelogin,(req,res)=>{
       Post.findByIdAndUpdate(req.body.postId,{
           $push:{likes:req.user._id}
       },{
           new:true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
            
        })
   })
   
   router .put('/unlike',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
     }).exec((err,result)=>{
         if(err){
             return res.status(422).json({error:err})
         }else{
             res.json(result)
         }
         
     })
})

module.exports=router
//in whatso ever '/' requirelogin is written u have to supply it with authorization and body 