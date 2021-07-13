const express = require("express")
const router=express.Router()
const mongoose = require("mongoose")
const requirelogin = require("../middleware/requirelogin")
const Post=mongoose.model("Post")
mongoose.set('useFindAndModify', false);

//for finding all the posts posted by the user 
router.get('/allpost',requirelogin, (req, res) => {
     Post.find()//finds all post
     .populate("postedBy","_id name")//expanding something is known as populate 
     .populate("comments.postedBy","_id name")
     .sort('-createdAt')//in descending order
     .then(posts=>{//name of the database that we have created 
         res.json({posts})
     })
     .catch(err=>{
         console.log(err)
     })
})
//getting the subscribed post 
router.get('/getsubpost', requirelogin, (req, res) => {
    Post.find({postedBy:{$in:req.user.following}})//for postedBy in following ,output is it will display only those only 
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('created at')//ascending order
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
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

router .put('/comment',requirelogin,(req,res)=>{
    const comment={text:req.body.text,
    postedBy:req.user._id}
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
     }) 
     .populate("comments.postedBy","_id name")
     .populate("postedBy", "_id name")
     .exec((err, result) => {
         if (err) {
             return res.status(422).json({ error: err })
         } else {
             res.json(result)
         }
 
     })
 })
 
 router.delete('/deletepost/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if (post.postedBy._id.toString()== req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({result})
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports=router
//in whatso ever '/' requirelogin is written u have to supply it with authorization and body 