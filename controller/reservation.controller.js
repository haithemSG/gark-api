const Reservation = require('../models/reservation.model');
const Terrain = require('../models/terrain.model');
const moment = require('moment');

module.exports = {
    create: async (req, res) => {

        const { Name, StartTime, EndTime, terrain, num, frais } = req.body;
        const myTerrain = await Terrain.findOne({ name: terrain, user: req.user })

        const reservation = new Reservation({
            name: Name,
            StartTime,
            EndTime,
            terrain: myTerrain,
            num,
            frais
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
        const { Name, StartTime, EndTime, terrain, num, frais } = req.body;
        const myTerrain = await Terrain.findOne({ name: terrain, user: req.user })
        let reservation = await Reservation.findOne({ _id });
        reservation.name = Name;
        reservation.StartTime = StartTime;
        reservation.EndTime = EndTime;
        reservation.terrain = myTerrain;
        reservation.num = num;
        reservation.frais= frais;
        await reservation.save();
        return res.json(reservation);
    },
    getAll: async (req, res) => {
        const user = req.user;
        const terrains = await Terrain.find({ user });
        let ids = terrains.map((el) => { return el._id })
        const reservations = await Reservation.find({ terrain: { $in: ids } }).populate('terrain');
        
        res.json({ reservations, user, terrains });
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

        // var curr = new Date; // get current date
        // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        // var last = first + 6; // last day is the first day + 6

        // console.log(first)
        // console.log(last)

        // var firstday = new Date(curr.setDate(first)).setHours(0,59,59,999);
        // var lastday = new Date(curr.setDate(last+1)).setHours(23,59,59,999);

        // console.log(new Date(firstday), new Date(lastday));

        const startOfWeek = +moment().startOf('week').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfWeek  = +moment().endOf('week').hours(23).minutes(59).seconds(59).milliseconds(99);

        // console.log("start", startOfWeek , "end", endOfWeek);
        // console.log("firstday", firstday , "lastday", lastday);

        const reservations = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $gte: startOfWeek ,
                $lte: endOfWeek
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

        // var start = new Date();
        // start.setHours(0,0,0,0);

        // var end = new Date();
        // end.setHours(23,59,59,999);
        //console.log((start), (end))

        const startOfDay = +moment().startOf('day').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfDay  = +moment().endOf('day').hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataToday = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: endOfDay ,
                $gte: startOfDay 
            } 
        });
        
        // var curr = new Date; // get current date
        // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        // var last = first + 6; // last day is the first day + 6

        // // console.log(first)
        // // console.log(last)

        // var firstday = new Date(curr.setDate(first)).setHours(0,0,0,0);
        // var lastday = new Date(curr.setDate(last)).setHours(23,59,59,999);

        // console.log(new Date(firstday), new Date(lastday));

        const startOfWeek = +moment().startOf('week').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfWeek  = +moment().endOf('week').hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataWeek = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: endOfWeek ,
                $gte: startOfWeek 
            } 
        });
        
        // var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        // var firstDayMonth = new Date(y, m, 1).setHours(1,0,0);
        // var lastDayMonth = new Date(y, m + 1, 0).setHours(00,59,59);

        // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
        // const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
        const startOfMonth = +moment().startOf('month').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfMonth  = +moment().endOf('month').hours(23).minutes(59).seconds(59).milliseconds(99);

        // console.log("start", startOfMonth , "end", endOfMonth);

        const dataMonth = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: endOfMonth ,
                $gte: startOfMonth 
            } 
        });
        res.json({ dataToday, dataWeek, dataMonth })
    },
    countReservationMoney : async (req, res)=>{

        const user = req.user;
        // console.log(user)
        const terrains = await Terrain.find({ user });
        // console.log("ussser", terrains);
        let ids = terrains.map((el) => { return el._id })

        // var start = new Date();
        // start.setHours(0,0,0,0);

        // var end = new Date();
        // end.setHours(23,59,59,999);
        //console.log((start), (end))

        const startOfDay = +moment().startOf('day').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfDay  = +moment().endOf('day').hours(23).minutes(59).seconds(59).milliseconds(99);
        const dataToday = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: endOfDay ,
                $gte: startOfDay 
            } 
        });
        
        // var curr = new Date; // get current date
        // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        // var last = first + 6; // last day is the first day + 6

        // var firstday = new Date(curr.setDate(first)).setHours(0,0,0,0);
        // var lastday = new Date(curr.setDate(last)).setHours(23,59,59,999);

        const startOfWeek = +moment().startOf('week').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfWeek  = +moment().endOf('week').hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataWeek = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: endOfWeek ,
                $gte: startOfWeek 
            } 
        });
        
        // var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        // var firstDayMonth = new Date(y, m, 1).setHours(1,0,0);
        // var lastDayMonth = new Date(y, m + 1, 0).setHours(00,59,59);

        const startOfMonth = +moment().startOf('month').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfMonth  = +moment().endOf('month').hours(23).minutes(59).seconds(59).milliseconds(99);

        const dataMonth = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: endOfMonth ,
                $gte: startOfMonth 
            } 
        });

        res.json({ dataToday, dataWeek, dataMonth })

    },
    getTerrainReservations : async(req,res,next)=>{
        const { _id } = req.params;
        const reservations = await Reservation.find({ terrain:  _id  }).populate('terrain');
        res.json({ reservations })
    },
    generateLastWeekStats: async (req, res) => {
        const user = req.user;
        // console.log(user)
        const terrains = await Terrain.find({ user });
        // console.log("ussser", terrains);
        let ids = terrains.map((el) => { return el._id })

        // var curr = new Date; // get current date
        // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        // var last = first; // last day is the first day + 6
        // first = first -7;
        // // console.log(first)
        // // console.log(last)

        // var firstday = new Date(curr.setDate(first)).setHours(0,59,59,999);
        // var lastday = new Date(curr.setDate(last)).setHours(0,59,59,999);

        // console.log(new Date(firstday), new Date(lastday));


        //.subtract(1, 'weeks')

        const startOfLastWeek = +moment().subtract(1, 'weeks').startOf('week').hours(0).minutes(0).seconds(0).milliseconds(0);
        const endOfLastWeek  = +moment().subtract(1, 'weeks').endOf('week').hours(23).minutes(59).seconds(59).milliseconds(99);
        const reservations = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $gte: startOfLastWeek ,
                $lte: endOfLastWeek
            } 
        });
        res.json(reservations)
    },
}