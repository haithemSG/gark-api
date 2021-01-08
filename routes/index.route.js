var express = require('express');
var router = express.Router();

router.use('/users', require('./users.route'));
router.use('/terrains', require('./terrains.route'));
router.use('/reservations', require('./reservation.route'));
router.use('/financials', require('./finance.route'));
router.use('/seances', require('./seance.route'));
router.use('/groups', require('./group.route'));
router.use('/joueurs', require('./joueur.route'));
router.use('/coachs', require('./coach.route'));

module.exports = router;
