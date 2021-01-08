const Group = require('../models/group.model');
const fs = require('fs');
const { promisify } = require('util')
const User = require('../models/user.model');
const { Console } = require('console');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};

module.exports = {
    create: async (req,res)=>{
        const entraineur = req.user
        const { name,joueurs } = req.body;
        joueursGroup = [];
        for (const element in joueurs) {
            console.log(joueurs[element])
             _id  = joueurs[element];
            const j = await User.findOne({ _id })
            joueursGroup.push(j);
        }
        const group = new Group({ name, entraineur: entraineur,joueurs:joueursGroup });
        await group.save();
        res.json(group);
    } ,
    delete: async (req,res)=>{
        const { _id } = req.params;
        const group = await Group.findOne({ _id });
        if(!group){
            return res.status(404).json("Group introuvable")
        }
        
        await Group.remove({ _id });
        return res.json("Group supprimer avec succès");
    },
    update: async (req,res)=>{
        const { _id } = req.params;
        const group = await Group.findOne({ _id });
        const { name} = req.body;
        Group.name=  titre;
        await group.save();
        return res.json(group);
    },
    getAll: async (req,res)=>{
        const groups = await Group.find();

        res.json(groups);
    },
    getByEntraineur: async (req,res)=>{
        const entraineur= req.user;
        const group = await Group.find({ entraineur: user });

        res.json({ group, entraineur });
    },
    getOne: async (req,res)=>{
        const { _id } = req.params;
        const group = await Group.findOne({ _id });
        res.json({ group });
    },
    affectJoueurs: async (req,res)=>{
        const { _id } = req.params;
        const group = await Group.findOne({ _id });
        const { joueurs} = req.body;
        group.joueurs=  joueurs;
        await group.save();
        return res.json(group);
    },
    
}