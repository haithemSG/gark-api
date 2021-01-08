const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const groupController = require('../controller/group.controller');


router.route('/')
    .get(passportJwt, groupController.getAll)
    .post(passportJwt, groupController.create)

router.route('/:_id')
    .delete(passportJwt , groupController.delete)
    .put(passportJwt , groupController.update)
    .get(passportJwt , groupController.getOne)

router.route('byEntraineur/:_id')
    .get(passportJwt , groupController.getByEntraineur)

router.route('affectJoueurs')
    .post(passportJwt , groupController.affectJoueurs)

module.exports = router