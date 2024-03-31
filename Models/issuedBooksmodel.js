const mongoose = require("mongoose");

const issueModelSchema=new mongoose.Schema({

    Name:{
        type:String,
        required:true
    },
    
    book:{
        type:String,
        required:true
    },
    
    email:{
        type:String
    },

    issueTime:{
        type:Date,
        default:Date.now
    },

    returnTime:{
        type:Date,
    },
    Fine:{
        type:Number
    },
    Request_id:{
        type:String
    }

})

const issueBookModel=mongoose.model("issueBookModel",issueModelSchema,"issueBookModel");

module.exports=issueBookModel;

