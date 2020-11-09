const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const terrainController = require('../controller/terrain.controller');


router.route('/')
    .get(passportJwt, terrainController.getAll)
    .post(passportJwt, terrainController.create)

router.route('/:_id')
    .delete(passportJwt , terrainController.delete)
    .put(passportJwt , terrainController.update)
    .get(passportJwt , terrainController.getOne)

router.put('/image/select/:_id', passportJwt , terrainController.updateImageSelect)

module.exports = router