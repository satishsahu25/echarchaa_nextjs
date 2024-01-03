const mongoose=require('mongoose');
const refreshSchema=new mongoose.Schema({

    token:{
        type:String,
        required:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    activated:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});


module.exports=mongoose.model('Refresh',refreshSchema);
