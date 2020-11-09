const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { jwt_secret } = require('../config/config');

const User = require('../models/user.model');
const { use } = require('passport');

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['__Secure-SSID'];
    }
    return token;
  }

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: jwt_secret,
}, async(payload, done) => {
    try {
        //console.log("payload", payload)
        const _id = payload.sub.ssid;
        const user = await User.findById({ _id });
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, true, { error : "Email" });
        }

        const isPasswordMatch = await user.isValidPassword(password);

        if (!isPasswordMatch) {
            return done(null, true , { error : "Password" });
        }

        console.log("pwd ok")
        if(!user.isActive && user.activationToken != ""){
            
            return done(null,true,{ error: "Active" })
            // return done(null,false,req.flash({
            //     message : "Activate your account First"
            // }))
        }

        return done(null, user);

    } catch (error) {
        return done(error, false);
    }
}));