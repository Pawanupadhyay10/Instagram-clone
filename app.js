const express=require('express')
const app=express()
const mongoose=require('mongoose')
const PORT=5000
const{MONGOURI}=require('./keys')
//9sZBODpeAEMomtoJ
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected',()=>{
    console.log("Mongo connected:");
})

mongoose.connection.on('error',(error) => {     
    console.log("error connected:",error);
})

require('./models/users')
require('./models/posts')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))



app.listen(PORT,()=>{
console.log("localhost::",PORT);
})