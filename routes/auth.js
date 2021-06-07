const express = require('express')
const router = express.Router()
router.get('/', (req, res) =>{
    res.send("hello world!!!")
})
/*posting name and password 
router.post('/signup',(req,res)=>{
    console.log(req.body)//console .log means printing in cmd
    // to access the name of the user we will request the body 
})*/
module.exports = router
const bycrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const mongoose = require('mongoose')
const User = mongoose.model("User");
const {JWT_SECRET}=require('../keys');//2 directories up 
const requirelogin=require('../middleware/requirelogin')

/*router.get('/protected',requirelogin, (req, res) =>{
     res.send("hello world!!!")
});*/

router.post('/signup', (req, res) => {
    const { name, email, passward } = req.body
    if (!email || !passward || !name) {
        return res.status(422).json({ error: "PLs add all field" })
    }
    User.findOne({ email: email })
        .then((saveduser) => {
            if (saveduser) {
                return res.status(422).json({ error: "error exist with different fields" })
            }
            /*saving in the database */
            bycrypt.hash(passward, 12)
                .then(haspassward => {
                    const user = new User({//name of the database 
                        email, passward: haspassward, name
                    })
                    user.save()
                        .then(user => {
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
    User.findOne({ email: email })//json format 
        .then((saveduser) => {
            if (!saveduser) {
                return res.status(422).json({ error: "error exist with different fields" })
            }
            bycrypt.compare(passward,saveduser.passward) //if we got user with email then compare password
                .then(doMatch => {//returns boolean value 
                    if(doMatch){
                            // res.json({ msg: "saved successfully" })
                            const token =jwt.sign({_id:saveduser._id},JWT_SECRET) // token is asigned by jwt on the basis of user id 
                            const {_id,name,email}=saveduser
                            res.json({token,user:{_id,name,email}})
                    }
                    else{
                return res.status(422).json({ error: "invalid fields" })
                    }
                })
        })
        .catch(err => {//if error is there in then block 
            console.log(err)
        })
});

