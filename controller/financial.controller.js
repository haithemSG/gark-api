const Finance = require('../models/finance.model')

module.exports = {
    getStats: async (req,res,next)=>{
        const user = req.user;
        const finances = await Finance.find({ user : user });
        
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

        let benifits = income - spent;
        return res.json({ income , spent, benifits })
    },
    createSpent : async (req,res,next)=>{
        const { label, type, amount } = req.body;
        const user = req.user;

        const finance = new Finance({
            label, type, amount, isSpent : true, user 
        });
        await finance.save();
        res.json(finance)
    },
    createIncome : async (req,res,next)=>{
        const { label, type, amount } = req.body;
        const user = req.user;

        const finance = new Finance({
            label, type, amount, isSpent : false, user 
        });
        await finance.save();
        res.json(finance)
    },
    getAll : async (req,res,next)=>{
        const finances = await Finance.find({ user : req.user });
        res.json({ finances })
    }
}