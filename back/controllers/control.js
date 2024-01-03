const UserDto = require("../dtos/user-dto");
const Otpservice = require("../services/Otpservice");
const hashService = require("../services/hashService");
const tokenService = require("../services/tokenService");
const userService = require("../services/userService");

class AuthController {
  
  async sendOtp(req, res) {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ msg: "Phone number required" });
    }

    //Generating OTP of 4 digit
    const otp = await Otpservice.generateOtp();
    const timetoExpire = 1000 * 60 * 2; //2 minutes
    const expiresIn = Date.now() + timetoExpire;
    const data = `${phone}.${otp}.${expiresIn}`;
    const hash = hashService.hashOtp(data);

    try {
      // await Otpservice.sendBySms(phone,otp);
      return res.json({
        hash: `${hash}.${expiresIn}`,
        phone: phone,
        otp: otp,
      });
    } catch (err) {
      res.status(500).json({ message: "message sending failed" });
    }

    // res.json({hash});
  }
  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;

    if (!otp || !hash || !phone) {
      res.status(400).json({ msg: "All fields are required" });
    }

    const [hashedOtp, expires] = hash.split(".");

    if (Date.now() > +expires) {
      res.status(400).json({
        msg: "OTP has been expired",
      });
      return;
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = Otpservice.verifyOtp(hashedOtp, data);

    if (!isValid) {
      res.status(400).json({
        msg: "Invalid OTP",
      });
      return;
    }

    let user;

    //Checking user already registered or not

    try {
      user = await userService.findUser({ phone: phone });
      if (!user) {
        user = await userService.createUser({ phone: phone });
      }
    } catch (err) {
      console.log(err);
    }

 

    //Generating JSON webtoken (token based authentication)

    const { accesstoken, refreshtoken } = tokenService.generateToken({
      _id: user._id,
      activated: false,
    });

    

   await tokenService.storeRefreshToken(refreshtoken, user._id);

    res.cookie("refreshtoken", refreshtoken, {
      maxAge: 1000 * 60 * 60 * 30 * 24,
      httpOnly: true,
    });
    res.cookie("accesstoken", accesstoken, {
      maxAge: 1000 * 60 * 60 * 30 * 24,
      httpOnly: true,
    });

    // //httpOnly se js code of client cannot read the cookies

    const userDto = new UserDto(user); //filtered data
    res.json({ user: userDto, auth: true });
  }

  async refresh(req, res) {
    //get refresh token from cookie

    const { refreshtoken: refreshtokenfromCookie } = req.cookies;

    //check validity of  refresh token
    let userdata;
    try {
      userdata = await tokenService.verifyRefreshToken(refreshtokenfromCookie);
    } catch (err) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    //check if token in db or not

    try {
      const token = await tokenService.findrefreshToken(
        userdata._id,
        refreshtokenfromCookie
      );

      if (!token) {
        return res.status(400).json({ msg: "Invalid token" });
      }
    } catch (err) {
      return res.status(500).json({ msg: "Invalid token" });
    }

    //check valid user
    const user = await userService.findUser({ _id: userdata._id });
    if (!user) {
      return res.status(400).json({ msg: "No user" });
    }

    //generate new token
    const { refreshtoken, accesstoken } = tokenService.generateToken({
      _id: userdata._id,
    });
    try {
      await tokenService.updateRefreshToken(userdata._id, refreshtoken);
    } catch (err) {
      return res.status(400).json({ msg: "Internal Server Error" });
    }

    //put in cookie
    res.cookie("refreshtoken", refreshtoken, {
      maxAge: 1000 * 60 * 60 * 30 * 24,
      httpOnly: true,
    });
    res.cookie("accesstoken", accesstoken, {
      maxAge: 1000 * 60 * 60 * 30 * 24,
      httpOnly: true,
    });

    //reponse
    const userDto = new UserDto(user); //filtered data
    res.json({ user: userDto, auth: true });
  }

  async logout(req, res) {
    //delete refreshtoken from DB and also
    console.log("Fdsfsd");
    const { refreshtoken } = req.cookies;
    await tokenService.deleteRefreshToken(refreshtoken);

    res.clearCookie("refreshtoken");
    res.clearCookie("accesstoken");
    res.json({ user: null, auth: false });
  }
}

//class ka object bhej rahe hai
module.exports = new AuthController();
