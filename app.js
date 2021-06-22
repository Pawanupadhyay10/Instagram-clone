const express=require('express')
const { globalAgent } = require('http')
const app=express()
const mongoose=require('mongoose')
const PORT= process.env.PORT ||5000
const{MONGOURI}=require('./config/keys')

//9sZBODpeAEMomtoJ

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected',()=>{
    console.log("Mongo connected:")
})


mongoose.connection.on('error',(error) => {
    console.log("error connected:",error)
})
require('./models/user') 
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path= require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,()=>{
console.log("server is running on ",PORT)
})
