const Seance = require('../models/seance.model');
const Group = require('../models/group.model');

const fs = require('fs');
const { promisify } = require('util')
const User = require('../models/user.model');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};
const moment = require('moment');

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
    generateStats: async (req, res) => {
        
        const startOfWeek = +moment().startOf('week').utcOffset(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfWeek = +moment().endOf('week').utcOffset(1).hours(23).minutes(59).seconds(59).milliseconds(99);

        const seances = await Seance.find({
            StartTime: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        });

        res.json(seances)
    },
    countSeance: async (req, res) => {


        const startOfDay = +moment().startOf('day').utcOffset(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfDay = +moment().endOf('day').utcOffset(1).hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataToday = await Seance.find({
            StartTime: {
                $lte: endOfDay,
                $gte: startOfDay
            }
        });

        const startOfWeek = +moment().startOf('week').utcOffset(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfWeek = +moment().endOf('week').utcOffset(1).hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataWeek = await Seance.find({
            StartTime: {
                $lte: endOfWeek,
                $gte: startOfWeek
            }
        });

        const startOfMonth = +moment().startOf('month').utcOffset(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfMonth = +moment().endOf('month').utcOffset(1).hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataMonth = await Seance.find({
            StartTime: {
                $lte: endOfMonth,
                $gte: startOfMonth
            }
        });
        res.json({ dataToday, dataWeek, dataMonth })
    },
    generateLastWeekStats: async (req, res) => {
      
        const startOfLastWeek = +moment().subtract(1, 'weeks').utcOffset(1).startOf('week').utcOffset(1).hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfLastWeek = +moment().subtract(1, 'weeks').utcOffset(1).endOf('week').utcOffset(1).hours(23).minutes(59).seconds(59).milliseconds(99);
        const seances = await Seance.find({
            StartTime: {
                $gte: startOfLastWeek,
                $lte: endOfLastWeek
            }
        });
        res.json(seances)
    },
   
}