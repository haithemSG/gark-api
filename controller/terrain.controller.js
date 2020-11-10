const Terrain = require('../models/terrain.model');
const Reservation = require('../models/reservation.model')
    
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
        const terrain = await Terrain.findOne({ _id });
        if(!terrain){
            return res.status(404).json("Terrain introuvable")
        }
        const reservations = await Reservation.find({ terrain })
        if(reservations.length != 0){
            for(let i=0; i<reservations.length; i++){
                await Reservation.remove({ _id : reservations[i]._id })
            }
        }
        await Terrain.remove({ _id });
        return res.json("Terrain supprimer avec succès");
    },
    update: async (req,res)=>{
        const { _id } = req.params;
        const terrain = await Terrain.findOne({ _id });
        const { name, address } = req.body;
        terrain.name=  name;
        terrain.address=  address;
         
        await terrain.save();
        return res.json(terrain);
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