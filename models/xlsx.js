const mongoose =require( 'mongoose');
const xlxs=mongoose.model("exam",mongoose.Schema({
     content:String,
     answer:String,
     def:String
}))
module.exports=xlxs;