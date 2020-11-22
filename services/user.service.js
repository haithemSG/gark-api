const config = require('../config/config');
const crypto = require('crypto');
const  User  = require('../models/user.model');
const JWT = require('jsonwebtoken');

const cryptCredentials = {
    algorithm: 'aes-256-ctr',
    password: config.encryption_url
}

var CryptoJS = require("crypto-js");

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

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(plainUrl), config.encryption_url).toString();
        // var crypted = ciphertext.update()
        ciphertext = ciphertext.toString().replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l');
        // var cipher = crypto.createCipher(cryptCredentials.algorithm, cryptCredentials.password);
        // var crypted = cipher.update(plainUrl, 'utf8', 'hex')
        // crypted += cipher.final('hex');
        return ciphertext;
    },
    decryptUrl: async (encryptedUrl) => {
        if (encryptedUrl == null || encryptedUrl == undefined) {
            return null;
        }

        encryptedUrl = encryptedUrl.replace(/p1L2u3S/g, '+' ).replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedUrl, config.encryption_url);
            if (bytes.toString()) {
              return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;

          } catch (e) {
              return "";
          }
        // var decipher = crypto.createDecipher(cryptCredentials.algorithm, cryptCredentials.password);
        // var dec = decipher.update(encryptedUrl, 'hex', 'utf8')
        // dec += decipher.final('utf8');
        // return dec;
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