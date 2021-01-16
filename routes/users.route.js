const express = require('express');
const router = require('express-promise-router')();
const { validateBody, schemas } = require('../helpers/validator');

const passport = require('passport');
const passportConfig = require('../config/passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJwt = passport.authenticate('jwt', { session: false });

const authenticationController = require('../controller/authentication.controller');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/profiles/');
  },
  filename: (req, file, cb) => {
    const newFileName = new Date().getTime().toString() + path.extname(file.originalname);
    cb(null, newFileName);
  }
});

const upload = multer({storage})

router.route('/sign-up')
  .post(validateBody(schemas.registerSchema), authenticationController.resgiterAccount);

router.route('/signin')
  .post( passportSignIn, authenticationController.login);

router.route('/profile')
  .get(passportJwt, authenticationController.getProfile)
  .put(passportJwt, authenticationController.updateProfile);

router.route('/profile-image')
  .post(passportJwt, upload.single('image'), authenticationController.updateProfileImage)

router.post('/update-password', passportJwt, authenticationController.updatePassword)

router.route('/signout')
  .get(passportJwt, authenticationController.signOut);

router.route('/forgot-password')
  .post(authenticationController.resetPasswordRequest)

router.route('/verify-reset')
  .post(authenticationController.verifyResetPasswordCredentials)

router.route('/reset-password')
  .post(authenticationController.doResetPassword)

router.get('/force', authenticationController.resetMe)

router.get('/test', (req,res)=>{ res.json({OK : "ss"}) })
router.get('/create-skandar', authenticationController.createS)

router.route('/assign-notif')
  .get(passportJwt, authenticationController.getNotificationToken)
  .put(passportJwt, authenticationController.updateNotificationToken)

module.exports = router;
