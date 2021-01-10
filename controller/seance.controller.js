const Seance = require('../models/seance.model');
const Group = require('../models/group.model');

const fs = require('fs');
const { promisify } = require('util')
const User = require('../models/user.model');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};

module.exports = {
    create: async (req,res)=>{
        const entraineur = req.user
        // if(entraineur.role !== 'coach'){
        //     return res.status(404).json("Unauthorized")
        // }
        const { title, StartTime, EndTime, description, idGroup } = req.body;
        
        const group = await Group.findOne({ _id: idGroup})

        
        const seance = new Seance({
            titre: title,
            StartTime,
            EndTime,
            entraineur: entraineur,
            group,
            description
        })
        await seance.save();
        res.json({ seance });
    } ,
    delete: async (req,res)=>{
        const { _id } = req.params;
        const seance = await Seance.findOne({ _id });
        if(!seance){
            return res.status(404).json("Seance introuvable")
        }
        
        await Seance.remove({ _id });
        return res.json("Seance supprimer avec succès");
    },
    update: async (req,res)=>{
        const { _id } = req.params;
        const { title, StartTime,EndTime,idGroup,description} = req.body;
        const group = await Group.findOne({ _id: idGroup})
        let seance = await Seance.findOne({ _id });
        seance.titre=  title;
        seance.StartTime = StartTime;
        seance.EndTime = EndTime;
        seance.group = group;
        seance.description=  description;
        await seance.save();
        return res.json(seance);
    },
    getAll: async (req,res)=>{
        const user = req.user;
        const seances = await Seance.find({ $or: [{ entraineur: user }, { group: user }]}).populate('entraineur').populate('group');
        res.json({ seances });
    },
    getByEntraineur: async (req,res)=>{
        const entraineur= req.user;
        const seance = await Seance.find({ entraineur: user });
        res.json({ seance, entraineur });
    },
    getOne: async (req,res)=>{
        const { _id } = req.params;
        const seance = await Seance.findOne({ _id });
        res.json({ seance });
    },
}