const config = require('../config/config');
const userService = require('../services/user.service');

const User = require('../models/user.model');

module.exports = {
    resgiterAccount: async (req, res, next) => {
        const { email, password, firstName, lastName, gender } = req.body;
        const emailToLowerCase = email.trim().toLowerCase();

        const isFound= await userService.isEmailUnique(emailToLowerCase);
        console.log("is Found", isFound)
        if (!isFound) {
            return res.status(401).json({ created: false, message: "Email already registred" });
        }

        const token = userService.generateActivationToken();

        // const user = new User({
        //     email: emailToLowerCase,
        //     password: password,
        //     profile: {
        //         firstName: firstName,
        //         lastName: lastName,
        //         gender: gender
        //     },
        //     isActive: false,
        //     activationToken: token
        // })
        const user = new User({
            email: emailToLowerCase,
            password: password,
            profile: {
                firstName: firstName,
                lastName: "",
                gender: ""
            },
            isActive: true,
            activationToken: ""
        })


        // const plainUrl = `token=${token}&uid=${user._id}`;
        // const encrypted = await userService.cryptUrl(plainUrl);
        // const link = `${config.frontServerUrl}activate/${encrypted}`;

        //await for sending Email
        await user.save();
        res.status(200).json({ created: true, user })
    },
    login: async (req, res, next) => {

        if(req.authInfo.error){
            const reason = req.authInfo.error;
            if(reason === "Active"){
                return res.status(400).json("Activate your account first");
            }else{
                return res.status(400).json("Credentials are incorrect");
            }
        }
        const token = userService.signInToken(req.user);
        res.cookie('__Secure-SSID', token, {
            httpOnly: true
        });
        console.log(res.cookie)
        res.status(200).json({ success: true, token });
    },
    signOut: async (req, res, next) => {
        res.clearCookie('__Secure-SSID');
        // console.log('I managed to get here!');
        res.json({ success: true });
    },
    getProfile: async (req, res, next) => {
        res.status(200).json(req.user);
    },
    updateProfile: async (req, res, next) => {
        let userToUpdate = req.user;
        const { email, password, firstName, lastName, gender, oldEmail } = req.body;
        const emailToLowerCase = email.trim().toLowerCase();
        //verify if it's his account
        if(oldEmail !== userToUpdate.email){
            console.log("verifying")
            return res.status(403).json({ updated : false , Message : "This is not your account !"});
        }
        if (userToUpdate.email != emailToLowerCase) {
            console.log("emails")
            //trying to update his email
            if (!userService.isEmailUnique(emailToLowerCase)) {
                return res.status(400).json({ updated: false, message: "Email already registred" });
            }
        }

        const isPasswordMatch = await userToUpdate.isValidPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ updated: false, Message: 'Password is incorrect' });
        }

        userToUpdate.email = emailToLowerCase;
        userToUpdate.profile.firstName = firstName;
        userToUpdate.profile.lastName = lastName;
        userToUpdate.profile.gender = gender;

        await userToUpdate.save();
        res.json({ updated: true, user: userToUpdate })
    },
    updatePassword: async (req, res, next) => {
        let user = req.user;

    },
    createMe: async (req, res, next) => {

        const email = "stayassine3@gmail.com";

        const isRegistred = await User.findOne({ email });
        if (!isRegistred) {
            const myAccount = new User({
                email: email,
                password: "azertysta",
                profile: {
                    firstName: "Yassine",
                    lastName: "Sta",
                    gender: "Male"
                },
                isActive: true,
                activationToken: ""
            });
            await myAccount.save();
            console.log("i'm created")
        } else {
            console.log("i'm already created")
        }
    }
}