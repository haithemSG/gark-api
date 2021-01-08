const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const joueurController = require('../controller/joueur.controller');


router.route('/')
    .get(passportJwt, joueurController.getAll)
    .post(passportJwt, joueurController.create)

router.route('/:_id')
    .delete(passportJwt , joueurController.delete)
    .get(passportJwt , joueurController.getOne)

module.exports = router