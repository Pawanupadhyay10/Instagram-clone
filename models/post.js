//An ObjectID is a unique 12-byte identifier which can be generated by MongoDB as the primary key ( _id ) for a collection
const mongoose=require('mongoose')
const{ObjectId}=mongoose.Schema.Types
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"no photo"
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    }

})
 mongoose.model("Post",postSchema)