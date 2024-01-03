const mongoose = require("mongoose");
const mongooseSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    name: { type: String, required: false },
    avatar: {
      type: String,
      required: false,
      get:(avatar)=>{
        if(avatar)return `${process.env.BASE_URL}${avatar}`
        return avatar
      }
    },
    activated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true,toJSON:{getters:true} }
);

module.exports = mongoose.model("User", mongooseSchema);
