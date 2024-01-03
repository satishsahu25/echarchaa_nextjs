const jwt = require("jsonwebtoken");
const RefreshModel = require("../models/RefreshModel");
require("dotenv").config();

class tokenService {
  generateToken(payload) {
    const accesstoken = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: "1m",
    });
    //by refresh token we can generate a new access token
    const refreshtoken = jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, {
      expiresIn: "1y",
    });
    return { accesstoken, refreshtoken };
  }

  async storeRefreshToken(token, userId) {
    try {
      await RefreshModel.create({ token, userId });
    } catch (err) {
      console.log(err);
    }
  }

  async verifyaccessToken(accesstoken) {
    return jwt.verify(accesstoken, process.env.SECRET_ACCESS_TOKEN);
  }

  async verifyRefreshToken(refreshtoken) {
    return jwt.verify(refreshtoken, process.env.SECRET_REFRESH_TOKEN);
  }

  async findrefreshToken(userid, refreshtoken) {
    return await RefreshModel.findOne({ userId: userid, token: refreshtoken });
  }


  async updateRefreshToken(userid, refreshtoken) {
    return await RefreshModel.updateOne(
      { userId: userid },
      { token: refreshtoken }
    );
  }

  async deleteRefreshToken(refreshtoken) {
    return await RefreshModel.deleteOne({ token: refreshtoken });
  }
}

module.exports = new tokenService();
