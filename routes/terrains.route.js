const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const terrainController = require('../controller/terrain.controller');

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null, 'public/images/terrains/');
    },
    filename: (req,file, cb)=>{
        const newFileName = new Date().getTime().toString() + path.extname(file.originalname);
        cb(null,newFileName);
    }
})

const upload = multer({storage})


router.route('/')
    .get(passportJwt, terrainController.getAll)
    .post(passportJwt, terrainController.create)

router.route('/:_id')
    .delete(passportJwt , terrainController.delete)
    .put(passportJwt , terrainController.update)
    .get(passportJwt , terrainController.getOne)

router.put('/image/select/:_id', passportJwt , terrainController.updateImageSelect)
router.post('/image/upload/:_id', passportJwt, upload.single('terrain'),  terrainController.uploadImage)

module.exports = router