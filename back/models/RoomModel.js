const mongoose=require('mongoose');
const roomSchema=new mongoose.Schema({

    topic:{
        type:String,
        required:true,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    roomtype:{
        type:String,
        required:true,
    },
    speakers:{
        type:[
            {type:mongoose.Schema.Types.ObjectId,ref:'User'}
        ],
        required:false
    }
},{timestamps:true});


module.exports=mongoose.model('Room',roomSchema);
