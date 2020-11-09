const express = require('express');
const router = require('express-promise-router')();
const { validateBody, schemas } = require('../helpers/validator');

const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const authenticationController = require('../controller/authentication.controller');

router.route('/sign-up')
  .post(validateBody(schemas.registerSchema), authenticationController.resgiterAccount);

router.route('/signin')
  .post(validateBody(schemas.authSchema),passportSignIn, authenticationController.login);  

router.route('/profile')
  .get(passportJwt, authenticationController.getProfile)
  .put( passportJwt, authenticationController.updateProfile);

router.route('/signout')
  .get(passportJwt, authenticationController.signOut);

module.exports = router;
