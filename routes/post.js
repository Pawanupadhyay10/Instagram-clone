const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requirelogin = require('../middleware/requirelogin');
const Post = mongoose.model("Post")

router.get('/allpost', requirelogin, (req, res) => {
    Post.find()
        .populate("postedBy","_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/getsubpost', requirelogin, (req, res) => {
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createpost', requirelogin, (req, res) => {
    const { title, body, pic } = req.body
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "PLs add all field" })
    }
    // req.user.passward=undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            console.log(err)
        })
})
// we have to make this route so that we can view the profile of his / her
router.get('/mypost', requirelogin, (req, res) => {
    Post.find({ postedBy:req.user._id})
        .populate("PostedBy","_id name")
        .then(mypost => {
            res.json({mypost})
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requirelogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }

    })
})

router.put('/unlike', requirelogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }

    })
})

router.put('/comment', requirelogin, (req, res) => {
    const comment={text:req.body.text,
    postedBy:req.user._id}
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments:comment}
    }, {
        new: true
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
        if (post.postedBy._id.toString()=== req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({result})
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router