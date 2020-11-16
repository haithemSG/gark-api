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

router.get('/generate/stats',passportJwt, reservationController.generateStats);

router.get('/generate/stats/last-week',passportJwt, reservationController.generateLastWeekStats);

router.route('/generate/top')
    .get(passportJwt, reservationController.topPlayers)

router.get('/generate/count', passportJwt, reservationController.countReservation)
router.get('/generate/countMoney', passportJwt, reservationController.countReservationMoney)



module.exports = router