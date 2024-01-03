const { default: mongoose } = require("mongoose");

function DBconnect(){

    const DBURL=process.env.DBURL;

    const dbname="ViChat"

    mongoose.connect(DBURL,{dbname},{
        useUnifiedUrlParser:true,
        useUnifiedTopology:true
    });

    const db=mongoose.connection;


    db.on("error", (err)=>{
        console.log(err);
    });

    db.once('open',()=>{
        console.log('DB connected')
    })

}

module.exports = DBconnect;