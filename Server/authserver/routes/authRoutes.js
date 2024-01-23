const express = require('express');
const {signup} = require('../connector/SignUp');
const router = express.Router();
const {sendotp} = require('../connector/OTP');
const {login} = require('../connector/Login');
const {forgotPassword} = require('../connector/ForgotPasswrod');
const {auth} = require('../middleware/auth');
const {changePassword} = require('../connector/changePassword');
const {updateProfile} = require('../connector/updateProfile');
const {updateEmail} = require('../connector/updateEmail');
const {autoLogin} = require('../connector/AutoLogin');
const {logout} = require('../connector/Logout');

router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.get("/login", login);
router.post("/forgotpassword", forgotPassword)
router.put("/changepassword", auth, changePassword);
router.put("/updateprofile", auth, updateProfile);
router.put("/updateemail", auth, updateEmail);
router.get('/autologin', auth, autoLogin);
router.put('/logout', auth, logout);

module.exports = router;