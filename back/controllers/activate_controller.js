const Jimp = require("jimp");
const path = require("path");
const userService = require("../services/userService");
const UserDto = require("../dtos/user-dto");
class ActivateController {
  async activate(req, res) {

    console.log("fds");
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      res.status(400).json({ msg: "All fields are required" });
    }

    //converting string to image from global class of Nodejs
    const buffer = Buffer.from(
      avatar.replace("data:image/jpeg;base64,", ""),
      "base64"
    );
    const imagepath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
      const jimpresp = await Jimp.read(buffer);
      jimpresp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagepath}`));
    } catch (err) {
      res.status(400).json({ msg: "All fields are required" });
    }
    

    const userId = req.user._id;
    try {
      //update user activated field
      const user = await userService.findUser({ _id: userId });

      if (!user) {
        res.status(400).json({
          msg: "User not found",
        });
      }

      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagepath}`;
      user.save();
      // console.log("fds");
      res.status(200).json({ user:new UserDto(user), auth: true });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new ActivateController();
