const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    filename : {
        type:String,
        required : true
    },
    filepath :{
        type:String,
        required :true
    },
    extractedText : {
        type:String
    },
    summary : {
        type:String
    },
    createdAt : {
        type:Date,
        default:Date.now
    }
    
})

module.exports = mongoose.model("File",fileSchema);