const crypto = require("crypto");
const hashService = require("./hashService");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true,
});
const smsFromNumber = process.env.SMS_FROM_NUMBER;

class Otpservice {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: smsFromNumber,
      body: `Your ViChat OTP is ${otp}`,
    });
  }
  verifyOtp(hashedotp, data) {
    let computedhash = hashService.hashOtp(data);

    return computedhash == hashedotp;
  }
}

module.exports = new Otpservice();
