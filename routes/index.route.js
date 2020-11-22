var express = require('express');
var router = express.Router();

router.use('/users', require('./users.route'));
router.use('/terrains', require('./terrains.route'));
router.use('/reservations', require('./reservation.route'));
router.use('/financials', require('./finance.route'));

module.exports = router;
