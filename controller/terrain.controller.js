const Terrain = require('../models/terrain.model');
const Reservation = require('../models/reservation.model')
const fs = require('fs');
const { promisify } = require('util')
const Complexe = require('../models/complexe.model');
const User = require('../models/user.model');
const unlinkAsync = promisify(fs.unlink)
let uploads = {};

module.exports = {
    create: async (req,res)=>{
        const user = req.user
        const { name, address, color , duration} = req.body;
        const terrain = new Terrain({ name, address , color, duration, user: user });
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
        const { name, address , color, duration} = req.body;
        terrain.name=  name;
        terrain.address=  address;
        terrain.color=  color;
        terrain.duration=  duration;
         
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

        if(terrain.image){
            if(terrain.image.indexOf('assets/') == -1){
                fs.unlink(`public/images/terrains/${terrain.image}`, (err)=>{
                    if(err) console.log("error deletong file", err);
                })
            }
        }

        terrain.image = image;
        await terrain.save();
        res.json({ terrain });
    },
    uploadImage: async (req,res,next)=>{
        const { _id } = req.params;
        let terrain = await Terrain.findOne({ _id }).populate('user');
        
        if(!terrain || terrain.user.email != req.user.email ){
            fs.unlink(`public/images/terrains/${req.file.filename}`, (err)=>{
                if(err) console.log("error deletong file", err);
            })
            return res.status(404).json({"message": 'Terrain introuvable'})
        }

        if(terrain.image){
            if(terrain.image && terrain.image.indexOf('assets/') == -1){
                fs.unlink(`public/images/terrains/${terrain.image}`, (err)=>{
                    if(err) console.log("error deletong file", err);
                })
            }
        }

        
        terrain.image = req.file.filename;
        await terrain.save();
        res.json({message : "success", image : terrain.image})
    },
    imageUploadStatus: async (req, res, next)=>{
        
        //From GET request 3 parameters below and store in variable
        let fileId = req.headers['x-file-id'];
        let name = req.headers['name'];
        let fileSize = parseInt(req.headers['size'], 10);
        if (name) {
            try { 
                let stats = fs.statSync('/public/images/terrains/' + name); //grabs file information and returns
                //checking file exists or not
                if (stats.isFile()) {
                    if (fileSize == stats.size) {
                        res.send({ 'status': 'file is present' }) //returns if file exists
                        return;
                    }
                    if (!uploads[fileId])
                        uploads[fileId] = {}
                    uploads[fileId]['bytesReceived'] = stats.size;//checks total amount of file uploaded
                }
            } catch (er) {

            }

        }
        let upload = uploads[fileId];
        if (upload)
            res.send({ "uploaded": upload.bytesReceived });//returns to FrontEnd amout of bytes uploaded
        else
            res.send({ "uploaded": 0 });
    },
    imageUpload: async (req, res, next)=>{
        let fileId = req.headers['x-file-id'];
        let startByte = parseInt(req.headers['x-start-byte'], 10);
        let name = req.headers['name'];
        let fileSize = parseInt(req.headers['size'], 10);
        if (uploads[fileId] && fileSize == uploads[fileId].bytesReceived) {
            res.end();
            return;
        }
        if (!fileId) {
            res.writeHead(400, "No file id");
            res.end(400);
        }
        
        if (!uploads[fileId])
            uploads[fileId] = {};

        let upload = uploads[fileId]; //Bytes of file already present

        let fileStream;

        //checking bytes of file uploaded and sending to server
        if (!startByte) {
            upload.bytesReceived = 0;
            let name = req.headers['name'];
            fileStream = fs.createWriteStream(`./public/images/terrains/${name}`, {
                flags: 'w' //with "w"(write stream ) it keeps on adding data
            });
        } else {
            if (upload.bytesReceived != startByte) {//if same name file is sent with different size it will not upload
                res.writeHead(400, "Wrong start byte");
                res.end(upload.bytesReceived);
                return;
            }
            // append to existing file
            fileStream = fs.createWriteStream(`./public/images/terrains/${name}`, {
                flags: 'a'
            });
        }

        req.on('data', function (data) {
            upload.bytesReceived += data.length; //adding length of data we are adding
        });

        req.pipe(fileStream);

        // when the request is finished, and all its data is written
        fileStream.on('close', function () {
            if (upload.bytesReceived == fileSize) {
                let names = name.split('.');
                let newName = +new Date() + "." + names[names.length - 1];
                fs.rename(`./public/images/terrains/${name}`, `./public/images/terrains/${newName}`, (err) => {
                    if (err) console.log("err");;
                })
                delete uploads[fileId];

                // can do something else with the uploaded file here
                res.send({
                    status: 'uploaded',
                    fileName: newName,
                    size: fileSize,
                    path: `images/terrains/${newName}`
                });
                res.end();
            } else {
                // connection lost, leave the unfinished file around
                res.writeHead(500, "Server Error");
                res.end();
            }
        });

        // in case of I/O error - finish the request
        fileStream.on('error', function (err) {
            res.writeHead(500, "File error");
            res.end();
        });
    },
    updateImageName: async (req,res,next)=>{
        const { _id } = req.params;
        let terrain = await Terrain.findOne({ _id });

        if(terrain.image){
            if(terrain.image.indexOf('assets') == -1){
                fs.unlink(`public/images/terrains/${terrain.image}`, (err)=>{
                    if(err) console.log("error deletong file", err);
                })
            }
        }

        terrain.image = req.body.imageName;
        await terrain.save();
        res.json(terrain)
    },
    createComplexe: async (req,res,next)=>{
        // const owner = req.user;
        const { _id } = req.params;
        const { address, numero, opening, closing, name } = req.body;
        const owner = await User.findOne({ _id })
        const complexe = new Complexe({
            owner, address, numero, opening, closing, name
        });
        await complexe.save();
        res.json(complexe)
    },
    getComplexe: async (req,res,next)=>{
        const user = req.user;
        const complexe = await Complexe.findOne({ owner: user });
        res.json(complexe);
    },
    updateComplexe: async (req,res,next)=>{
        const user = req.user;
        const { _id, name, address,numero, opening, closing } = req.body;
        if(_id){
            let complexe = await Complexe.findOne({ _id }).populate('owner');
            if(complexe){
                if(complexe.owner._id.equals(user._id) ){
                    complexe.name= name,
                    complexe.address= address;
                    complexe.opening= opening;
                    complexe.closing = closing;
                    complexe.numero = numero;
                    await complexe.save();
                    return res.json({ updated : true, Message: "Complexe mis à jour avec succès", complexe })
                }
                return res.json({ updated : false ,  Message: "Vous n'êtes pas le proprietaire de ce complexe" })
            }   
        }        
        const newComplexe = new Complexe({
            name,
            address,
            owner: user,
            numero,
            opening,
            closing
        });
        await newComplexe.save();
        return res.json({ updated : false, Message: "Complexe créé avec succès" , complexe : newComplexe })
    }
}