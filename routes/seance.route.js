const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const seanceController = require('../controller/seance.controller');


router.route('/')
    .get(passportJwt, seanceController.getAll)
    .post(passportJwt, seanceController.create)

router.route('/:_id')
    .delete(passportJwt , seanceController.delete)
    .put(passportJwt , seanceController.update)
    .get(passportJwt , seanceController.getOne)

router.route('byEntraineur/:_id')
    .get(passportJwt , seanceController.getByEntraineur)


module.exports = router