const tokenService = require("../services/tokenService");

module.exports = async function (req, res, next) { 
 
  try {
    const { accesstoken } = req.cookies;
   
   
    if(!accesstoken) {
       res.status(400).json({msg:"Some error occurred"});
       return;
    }
   
    const userdata = await tokenService.verifyaccessToken(accesstoken);

   

    if (!userdata) {
      return res.status(400).json({msg:"Some error occurred 2"})
    }
    req.user = userdata;

    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
};
