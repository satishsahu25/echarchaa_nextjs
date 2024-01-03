const crypto = require('crypto');
require('dotenv').config();
class hashService{

   hashOtp(data){
        const hashed=
        crypto.createHmac('sha256',process.env.HASH_SECRET)
        .update(data).digest('hex');

        return hashed;
    }

}

module.exports = new hashService();