const Finance = require('../models/finance.model')
const Reservation = require('../models/reservation.model')
const Terrain = require('../models/terrain.model')
const moment = require('moment')
module.exports = {
    getStats: async (req,res,next)=>{
        const user = req.user;
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDayMonth = new Date(y, m, 1).setHours(1,0,0);
        var lastDayMonth = new Date(y, m + 1, 0).setHours(00,59,59);

        const terrains = await Terrain.find({ user });
        let ids = terrains.map((el) => { return el._id })

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
        const finances = await Finance.find({ user : user,  date: {
            $lte: lastDayMonth ,
            $gte: firstDayMonth 
        } });

        if(!finances){
            return res.json({ "income" : 0 , "spent" : 0 , "benifits" : 0 })
        }

        let income = 0;
        let spent = 0;
        
        finances.forEach((el)=>{
            if(el.isSpent){
                spent += el.amount
            }else{
                income += el.amount
            }
        })

        dataMonth.forEach((el)=>{
            income += el.frais || 0;
        })

        let benifits = income - spent;
        return res.json({ income , spent, benifits })
    },
    createSpent : async (req,res,next)=>{
        const { label, type, amount, date } = req.body;
        const user = req.user;

        const finance = new Finance({
            label, type, amount, isSpent : true, user , date
        });
        await finance.save();
        res.json(finance)
    },
    createIncome : async (req,res,next)=>{
        const { label, type, amount, date } = req.body;
        const user = req.user;
        console.log(date);
        const finance = new Finance({
            label, type, amount, isSpent : false, user ,date
        });
        console.log(finance);
        await finance.save();
        res.json(finance)
    },
    getAll : async (req,res,next)=>{

        const user = req.user;
        const terrains = await Terrain.find({ user });
        // console.log("ussser", terrains);
        let ids = terrains.map((el) => { return el._id })

        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDayMonth = new Date(y, m, 1).setHours(1,0,0);
        var lastDayMonth = new Date(y, m + 1, 0).setHours(00,59,59);


        let finances = await Finance.find({ 
            user : user,
            date: {
                $lte: lastDayMonth ,
                $gte: firstDayMonth 
            }
         });

        // console.log("here");
        const dataMonth = await Reservation.find({ 
            terrain: { $in: ids }, 
            StartTime: { 
                $lte: lastDayMonth ,
                $gte: firstDayMonth 
            } 
        });

        let reservationIncomePerDay = dataMonth.reduce(function (result, reservation) {
            // console.log(result, re)
            var day = moment(reservation.StartTime).format('YYYY-MM-DD');
            if (!result[day]) {
              result[day] = 0;
            }
            result[day] += reservation.frais;
            return result;
          }, {});

          const objectArray = Object.entries(reservationIncomePerDay);
          let reservationsArray = [];
          objectArray.forEach(([key,value])=>{
            reservationsArray.push({ day : key , income : value })
            if(+value != 0){
              let f = new Finance({
                  amount : +value,
                  date: new Date(key),
                  isSpent : false,
                  label: "Réservations"
              });
           
              finances.push(f)
            }
          })


        // console.log(dataMonth);
       

        res.json({ finances, dataMonth })
    }
}