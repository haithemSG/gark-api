const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const entraineurController = require('../controller/entraineur.controller');


router.route('/')
    .get(passportJwt, entraineurController.getAll)
    .post(passportJwt, entraineurController.create)

router.route('/:_id')
    .delete(passportJwt , entraineurController.delete)
    .get(passportJwt , entraineurController.getOne)

module.exports = router