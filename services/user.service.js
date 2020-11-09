const config = require('../config/config');
const crypto = require('crypto');
const  User  = require('../models/user.model');
const JWT = require('jsonwebtoken');

const cryptCredentials = {
    algorithm: 'aes-256-ctr',
    password: config.encryption_url
}

module.exports = {
    isEmailUnique: async (email) => {
        const user = await User.findOne({ email });
        console.log("user",user)
        if (user) {
            console.log("user found")
            return false;
        }
        console.log("user not found")
        return true;
    },
    generateActivationToken : () => {
        return crypto.randomBytes(64).toString('base64');
    },
    cryptUrl: async (plainUrl) => {
        if (plainUrl == null || plainUrl == undefined) {
            return null;
        }
        var cipher = crypto.createCipher(cryptCredentials.algorithm, cryptCredentials.password);
        var crypted = cipher.update(plainUrl, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decryptUrl: async (encryptedUrl) => {
        if (encryptedUrl == null || encryptedUrl == undefined) {
            return null;
        }
        var decipher = crypto.createDecipher(cryptCredentials.algorithm, cryptCredentials.password);
        var dec = decipher.update(encryptedUrl, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    },
    signInToken : (user) => {
        return JWT.sign({
            iss: 'project',
            sub: {
                ssid: user._id,
                auth_id: user.role
            },
            iat: new Date().getTime(), //current time
            exp: new Date().setHours(new Date().getDate() + 1) //will expire in 1 day
        }, config.jwt_secret);
    },
}