const config = require('../config/config');
const userService = require('../services/user.service');
const emailService = require('../services/email.service');

const User = require('../models/user.model');
const fs = require('fs');

module.exports = {
    resgiterAccount: async (req, res, next) => {
        const { email, password, firstName, lastName } = req.body;
        const emailToLowerCase = email.trim().toLowerCase();

        const isFound = await userService.isEmailUnique(emailToLowerCase);
        console.log("is Found", isFound)
        if (!isFound) {
            return res.json({ created: false, message: "Email already registred" });
        }

        const token = userService.generateActivationToken();
        
        const user = new User({
            email: emailToLowerCase,
            password: password,
            profile: {
                firstName: firstName,
                lastName: lastName,
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

        console.log("test");
        if (req.authInfo.error) {
            const reason = req.authInfo.error;
            if (reason === "Active") {
                return res.status(400).json("Activate your account first");
            } else {
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



        // console.log(req.body);
        // console.log(userToUpdate);

        const { email, password, profile } = req.body;

        if (email.toLowerCase() != userToUpdate.email.toLowerCase()) {
            return res.status(403).json({ Message: "Erreur Fatal ! vous n'êtes pas autorisé à mettre à jour ce profile!" })
        }

        // const emailToLowerCase = email.trim().toLowerCase();
        //verify if it's his account
        // if(oldEmail !== userToUpdate.email){
        //     console.log("verifying")
        //     return res.status(403).json({ updated : false , Message : "This is not your account !"});
        // }
        // if (userToUpdate.email != emailToLowerCase) {
        //     console.log("emails")
        //     //trying to update his email
        //     if (!userService.isEmailUnique(emailToLowerCase)) {
        //         return res.status(400).json({ updated: false, message: "Email already registred" });
        //     }
        // }

        const isPasswordMatch = await userToUpdate.isValidPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ updated: false, Message: 'Mot de passe incorrect!' });
        }

        // userToUpdate.email = emailToLowerCase;
        userToUpdate.profile.firstName = profile.firstName;
        userToUpdate.profile.lastName = profile.lastName;
        userToUpdate.profile.telephone = profile.telephone;
        userToUpdate.profile.address = profile.address;

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
    },
    createS: async (req, res, next) => {

        const email = "skanderamor@gmail.com";

        const isRegistred = await User.findOne({ email });
        if (!isRegistred) {
            const myAccount = new User({
                email: email,
                password: "skander",
                profile: {
                    firstName: "Skander",
                    lastName: "Skander",
                    gender: "Male"
                },
                isActive: true,
                activationToken: ""
            });
            await myAccount.save();
            res.json({ myAccount })
        } else {
            console.log("i'm already created")
            res.json({ isRegistred })
        }
    },
    resetMe: async (req, res, next) => {

        const email = "stayassine3@gmail.com";

        const me = await User.findOne({ email });
        me.password = "azertysta";
        await me.save();
        res.json({ "ok": me })


    },
    updatePassword: async (req,res,next)=>{
        const user = req.user;

        const { old, newPassword }= req.body;

        const isPasswordMatch = await user.isValidPassword(old);
        if (!isPasswordMatch) {
            return res.json({ updated: false, Message: 'Mot de passe incorrect!' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ updated :true , Message: "Mot de passe mis à jour avec succès"})
    },
    resetPasswordRequest: async (req, res, next) => {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ Email: false, Message: 'Utilisateur introuvable' });
        }
        if (!user.isActive) {
            return res.status(404).json({ Email: true, created: false, Message: 'Votre compte n\'est pas active' });
        }
        const resetToken = await userService.generateActivationToken();
        user.resetPasswordToken = resetToken;
        await user.save();
        const plainUrl = `token=${user.resetPasswordToken}&uid=${user._id}`;
        const encrypted = await userService.cryptUrl(plainUrl);
        const link = `${config.frontServerUrl}user/reset-password/${encrypted}`;
        await emailService.sendResetPasswordLink(user, link, function (data) {
            res.status(200).json({ email, created: true, data });
        });
    },
    verifyResetPasswordCredentials: async (req, res, next) => {
        const { creds } = req.body;
        if (!creds) {
            return res.json({ creds: false, Message: 'Ce lien est invalide!' });
        }

        const decoded = await userService.decryptUrl(creds);
        if (decoded.indexOf('token') == -1 || decoded.indexOf('uid') == -1) {
            return res.json({ creds: false, Message: 'Veuillez reconsulter votre boite mail, ce lien a expiré' });
        }

        const splitedUrl = decoded.split('&');
        const token = splitedUrl[0].replace('token=', '');
        const userId = splitedUrl[1].replace('uid=', '');

        console.log("provided", token);
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ creds: false, Message: 'Utilisateur non trouvable' });
        }

        console.log("saved", user.resetPasswordToken);
        if (user.resetPasswordToken != token) {
            return res.json({ creds: false, Message: 'Ce lien a expiré' });
        }
        console.log(user.resetPasswordToken == token);

        res.json({
            creds: true,
            Message: 'Credentials are correct',
            xd: userId,
            name: `${user.profile.firstName} ${user.profile.lastName}`,
            email: user.email
        }).status(200);
    },
    doResetPassword: async (req, res, next) => {
        const { _id, password } = req.body;
        let user = await User.findOne({ _id });
        user.password = password;
        user.resetPasswordToken = '';
        await user.save();
        res.json({ success: true })
    },
    updateProfileImage: async (req, res, next) => {
        const user = req.user;
        console.log(user);
        if (user.profile.picture) {
            fs.unlinkSync(`./public/images/profiles/${user.profile.picture}`, (err) => {
                if (err) console.log(err)
            })
        }
        user.profile.picture = req.file.filename;
        console.log(user);
        await user.save();
        console.log("saved");
        // user.password = null;
        // delete user.password;
        res.json(user);
    },
    updateNotificationToken: async (req,res,next)=>{
        const user = req.user;
        const { token } = req.body;

        user.notificationToken =  token;
        await user.save();
        res.json({ update: true, token : user.notificationToken });
    },
    getNotificationToken: async (req,res,next)=>{
        const user = req.user;
        
        res.json({token : user.notificationToken });
    }
}
