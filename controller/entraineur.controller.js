const Seance = require('../models/seance.model');
const fs = require('fs');
const { promisify } = require('util')
const User = require('../models/user.model');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};
const userService = require('../services/user.service');

module.exports = {
    delete: async (req,res)=>{
        const { _id } = req.params;
        const user = await User.findOne({ _id });
        if(!user){
            return res.status(404).json("Entraineur introuvable")
        }
        
        await User.remove({ _id });
        return res.json("Entraineur supprimer avec succès");
    },
    getAll: async (req,res)=>{
        const entraineurs = await User.find({ role:'coach' });

        res.json(entraineurs);
    },
    getOne: async (req,res)=>{
        const { _id } = req.params;
        const entraineur = await User.findOne({ _id,role:'coach' });
        res.json({ entraineur });
    },  
    create: async (req, res, next) => {
        const { email, password, fullName,telephone,address,dateOfBirth } = req.body;
        console.log(fullName)
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
                fullName: fullName,
                gender: "",
                telephone:telephone,
                address:address,
                dateOfBirth:dateOfBirth,
                rate:0  
            },
            role:'coach',
            isActive: true,
            activationToken: ""
        })


        // const plainUrl = `token=${token}&uid=${user._id}`;
        // const encrypted = await userService.cryptUrl(plainUrl);
        // const link = `${config.frontServerUrl}activate/${encrypted}`;

        //await for sending Email
        await user.save();
        res.status(200).json({ created: true, user })
    }
    
}