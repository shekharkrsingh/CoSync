const express = require('express');
const {signup} = require('../controllers/SignUp');
const router = express.Router();
const {sendotp} = require('../controllers/OTP');
const {login} = require('../controllers/Login');
const {forgotPassword} = require('../controllers/ForgotPasswrod');
const {auth} = require('../middleware/auth');
const {changePassword} = require('../controllers/changePassword');
const {updateEmail} = require('../controllers/updateEmail');
const {userData} = require('../controllers/userData');
const {logout} = require('../controllers/Logout');

router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword)
router.put("/changepassword", auth, changePassword);
router.put("/updateemail", auth, updateEmail);
router.get('/userdata', auth, userData);
router.put('/logout', auth, logout);

module.exports = router;