const fs = require('fs');
const { promisify } = require('util');
const Group = require('../models/group.model');
const User = require('../models/user.model');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};
const userService = require('../services/user.service');

module.exports = {
    delete: async (req,res)=>{
        const { _id } = req.params;
        const user = await User.findOne({ _id });
        if(!user){
            return res.status(404).json("Joueur introuvable")
        }
        
        await User.remove({ _id });
        return res.json("Joueur supprimer avec succès");
    },
    getAll: async (req,res)=>{
        const joueurs = await User.find({ role:'joueur' });

        res.json(joueurs);
    },
    getOne: async (req,res)=>{
        console.log(req.params)
        const { _id } = req.params;
        const joueur = await User.findOne({ _id,role:'joueur' });
        res.json({ joueur });
    }, 
    create: async (req, res, next) => {
        const { email, password, fullName,telephone,address,dateOfBirth,height,weight,preferedFoot,position,description,attributeDetails,kitNumber } = req.body;
        console.log(req.body)
        const emailToLowerCase = email.trim().toLowerCase();
        console.log(req.body)
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
                height:height,
                weight:weight,
                preferedFoot:preferedFoot,
                position: {
                    label: position
                },
                description:description,
                attributeDetails:{
                    pace:{
                        value:(attributeDetails.acceleration + attributeDetails.sprintSpeed) /2 ,
                        acceleration:attributeDetails.acceleration,
                        sprintSpeed:attributeDetails.sprintSpeed
                    },
                    shooting:{
                        value:(attributeDetails.attPosition + attributeDetails.finishing+ attributeDetails.shotPower+ attributeDetails.longShots+ attributeDetails.volleys+ attributeDetails.penalties) /6,
                        attPosition:attributeDetails.attPosition,
                        finishing:attributeDetails.finishing,
                        shotPower:attributeDetails.shotPower,
                        longShots:attributeDetails.longShots,
                        volleys:attributeDetails.volleys,
                        penalties:attributeDetails.penalties
                    },
                    passing:{
                        value:(attributeDetails.vision + attributeDetails.crossing+ attributeDetails.fkAcc+ attributeDetails.shortPass+ attributeDetails.longPass+ attributeDetails.curve) /6 ,
                        vision:attributeDetails.vision,
                        crossing:attributeDetails.crossing,
                        fkAcc:attributeDetails.fkAcc,
                        shortPass:attributeDetails.shortPass,
                        longPass:attributeDetails.longPass,
                        curve:attributeDetails.curve
                    },
                    dribbling:{
                        value:(attributeDetails.agility + attributeDetails.balance+ attributeDetails.reactions+ attributeDetails.ballControl+ attributeDetails.dribbling+ attributeDetails.composure) /6 ,
                        agility:attributeDetails.agility,
                        balance:attributeDetails.balance,
                        reactions:attributeDetails.reactions,
                        ballControl:attributeDetails.ballControl,
                        dribbling:attributeDetails.dribbling,
                        composure:attributeDetails.composure,
                    },
                    defending:{
                        value:(attributeDetails.interceptions + attributeDetails.headingAcc+ attributeDetails.defAware+ attributeDetails.standTackle+ attributeDetails.slideTackle) /5 ,
                        interceptions:attributeDetails.interceptions,
                        headingAcc:attributeDetails.headingAcc,
                        defAware:attributeDetails.defAware,
                        standTackle:attributeDetails.standTackle,
                        slideTackle:attributeDetails.slideTackle,
                    },
                    physical:{
                        value:(attributeDetails.jumping + attributeDetails.stamina+ attributeDetails.strength+ attributeDetails.aggression) /4 ,
                        jumping:attributeDetails.jumping,
                        stamina:attributeDetails.stamina,
                        strength:attributeDetails.strength,
                        aggression:attributeDetails.aggression,
                    }
                },
                kitNumber: kitNumber
            },
            role:'joueur',
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