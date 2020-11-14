const Reservation = require('../models/reservation.model');
const Terrain = require('../models/terrain.model');
const moment = require('moment');

module.exports = {
    create: async (req, res) => {

        const { Name, StartTime, EndTime, terrain, num } = req.body;
        const myTerrain = await Terrain.findOne({ name: terrain, user: req.user })

        const reservation = new Reservation({
            name: Name,
            StartTime,
            EndTime,
            terrain: myTerrain,
            num
        })
        await reservation.save();
        res.json({ reservation, terrain });
    },
    delete: async (req, res) => {
        const { _id } = req.params;
        const terrain = await Reservation.findOneAndDelete({ _id });
        if (terrain) {
            return res.json("deleted")
        }
        return res.json("erreur");
    },
    update: async (req, res) => {
        const { _id } = req.params;
        const { Name, StartTime, EndTime, terrain, num } = req.body;
        const myTerrain = await Terrain.findOne({ name: terrain, user: req.user })
        let reservation = await Reservation.findOne({ _id });
        reservation.name = Name;
        reservation.StartTime = StartTime;
        reservation.EndTime = EndTime;
        reservation.terrain = myTerrain;
        reservation.num = num;
        await reservation.save();
        return res.json(reservation);
    },
    getAll: async (req, res) => {
        const user = req.user;
        const terrains = await Terrain.find({ user });
        let ids = terrains.map((el) => { return el._id })
        const reservations = await Reservation.find({ terrain: { $in: ids } }).populate('terrain');
        res.json({ reservations, user });
    },
    getOne: async (req, res) => {
        const { _id } = req.params;
        const terrain = await Terrain.findOne({ _id });
        res.json({ terrain });
    },
    generateStats: async (req, res) => {
        const user = req.user;
        // console.log(user)
        const terrains = await Terrain.find({ user });
        // console.log("ussser", terrains);
        let ids = terrains.map((el) => { return el._id })
        var curr = new Date;
        var firstday = (new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)).setHours(1,0,0));
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).setHours(00,59,59);

        const reservations = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: lastday ,
                $gte: firstday 
            } 
        });
        res.json(reservations)
    },
    topPlayers: async (req,res)=>{
        const user = req.user;
        const terrains = await Terrain.find({ user });
        let ids = terrains.map((el) => { return el._id })
        const reservations = await Reservation.find({ 
            terrain: { $in: ids } 
        });
        res.json(reservations)
    },
    countReservation : async (req, res)=>{

        const user = req.user;
        // console.log(user)
        const terrains = await Terrain.find({ user });
        // console.log("ussser", terrains);
        let ids = terrains.map((el) => { return el._id })

        var start = new Date();
        start.setHours(0,0,0,0);

        var end = new Date();
        end.setHours(23,59,59,999);
        //console.log((start), (end))
        const dataToday = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: end ,
                $gte: start 
            } 
        });
        
        var curr = new Date;
        var firstday = (new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)).setHours(1,0,0));
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).setHours(00,59,59);

        const dataWeek = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: lastday ,
                $gte: firstday 
            } 
        });
        
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDayMonth = new Date(y, m, 1).setHours(1,0,0);
        var lastDayMonth = new Date(y, m + 1, 0).setHours(00,59,59);

        const dataMonth = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: lastDayMonth ,
                $gte: firstDayMonth 
            } 
        });

        res.json({ dataToday, dataWeek, dataMonth })

    },
    getTerrainReservations : async(req,res,next)=>{
        const { _id } = req.params;
        const reservations = await Reservation.find({ terrain:  _id  }).populate('terrain');
        res.json({ reservations })
    }
}