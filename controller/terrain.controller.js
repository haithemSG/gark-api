const Terrain = require('../models/terrain.model');
const Reservation = require('../models/reservation.model')
const fs = require('fs');


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
    uploadImage: async (req,res,next)=>{
        const { _id } = req.params;
        let terrain = await Terrain.findOne({ _id }).populate('user');
        // console.log("terrain", terrain);
        // console.log(terrain.user._id , req.user._id );
        // console.log("vs", terrain.user._id != req.user._id );

        console.log(terrain);

        // console.log(req.user.email)
        // console.log(terrain.user.email);
        // console.log(!terrain);
        // console.log(terrain.user.email != req.user.email);
        // console.log(terrain || terrain.user._id != req.user._id);
        
        if(!terrain || terrain.user.email != req.user.email ){
            fs.unlinkSync(`public/images/terrains/${req.file.filename}`, (err)=>{
                if(err) console.log("error deletong file", err);
            })
            return res.status(404).json({"message": 'Terrain introuvable'})
        }

        if(terrain.image){
            console.log("there is an image")
            if(terrain.image && terrain.image.indexOf('assets/') == -1){
                console.log("deleting")
                fs.unlinkSync(`public/images/terrains/${terrain.image}`, (err)=>{
                    if(err) console.log("error deletong file", err);
                })
            }
        }

        
        terrain.image = req.file.filename;
        await terrain.save();
        res.json({message : "success", image : terrain.image})
    }
}