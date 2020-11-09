const Terrain = require('../models/terrain.model');

    
module.exports = {
    create: async (req,res)=>{
        const user = req.user
        const { name, address } = req.body;
        const terrain = new Terrain({ name, address , user: user });
        await terrain.save();
        res.json(terrain);
    } ,
    delete: async (req,res)=>{
        const { _id } = req.params;
        const terrain = await Terrain.findOneAndDelete({ _id });
        if(terrain){
            return res.json("deleted")
        }
        return res.json("erreur");
    },
    update: async (req,res)=>{
        const { _id } = req.params;
        // const terrain = await Terrain.findOneAndDelete({ _id });
        // if(terrain){
        //     return res.json("deleted")
        // }
        return res.json("erreur " + _id);
    },
    getAll: async (req,res)=>{
        const user= req.user;
        const terrain = await Terrain.find({ user: user });

        res.json({ terrain, user });
    },
    getOne: async (req,res)=>{
        const { _id } = req.params;
        const terrain = await Terrain.findOne({ _id });
        res.json({ terrain });
    },
    updateImageSelect: async (req,res)=>{
        const { _id } = req.params;
        let terrain = await Terrain.findOne({ _id });
        const  { image } = req.body;
        terrain.image = image;
        await terrain.save();
        res.json({ terrain });
    },

}