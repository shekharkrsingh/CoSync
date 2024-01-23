const validator = require('validator');
const User = require('../models/User')
const otpGenerator = require("otp-generator");
const OTP = require('../models/OTP')

exports.sendotp = async (req, res) => {
    try {
        const {email} = req.body;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({success: false, message: "Invalid email format"});
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const result = await OTP.findOne({otp});
        console.log("Result is Generate OTP Func");
        console.log("OTP", otp);
        console.log("Result", result);

        while (result) {
            otp = otpGenerator.generate(6, {upperCaseAlphabets: false});
        }

        const otpPayload = {
            email,
            otp
        };

        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);

        res
            .status(200)
            .json({success: true, message: `OTP Sent Successfully`, otp});

    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({success: false, message: "Auth server error, Error on sending otp"});
    }
};
