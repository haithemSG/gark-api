const router = require('express-promise-router')();


const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const reservationController = require('../controller/reservation.controller');


router.route('/')
    .get(passportJwt, reservationController.getAll)
    .post(passportJwt, reservationController.create)

router.route('/:_id')
    .delete(passportJwt , reservationController.delete)
    .put(passportJwt , reservationController.update)
    .get(passportJwt , reservationController.getOne)
    .patch(reservationController.getTerrainReservations)

router.route('/generate/stats')
    .get(passportJwt, reservationController.generateStats)
router.route('/generate/top')
    .get(passportJwt, reservationController.topPlayers)

router.get('/generate/count', passportJwt, reservationController.countReservation)



module.exports = router