const Seance = require('../models/seance.model');
const fs = require('fs');
const { promisify } = require('util')
const User = require('../models/user.model');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};

module.exports = {
    create: async (req,res)=>{
        const entraineur = req.user
        if(entraineur.role !== 'coach'){
            return res.status(404).json("Unauthorized")
        }
        const { titre, address,date,duration,description} = req.body;
        const seance = new Seance({ titre, address,date,duration,description, entraineur: entraineur });
        await seance.save();
        res.json(seance);
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
        const seance = await Seance.findOne({ _id });
        const { titre, address,date,duration,description} = req.body;
        seance.titre=  titre;
        seance.address=  address;
        seance.date=  date;
        seance.duration=  duration;
        seance.description=  description;

        await seance.save();
        return res.json(seance);
    },
    getAll: async (req,res)=>{
        const seances = await Seance.find();

        res.json(seances);
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
    affectJoueurs: async (req,res)=>{
        const { _id } = req.params;
        if(req.user.role !== 'coach'){
            return res.status(404).json("Unauthorized")
        }
        const seance = await Seance.findOne({ _id });
        const { joueurs} = req.body;
        seance.joueurs=  joueurs;
        await seance.save();
        return res.json(seance);
    },
    
}