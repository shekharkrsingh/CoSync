const validator = require('validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require("bcrypt")

exports.forgotPassword = async (req, res) => {
    try {

        const {email, password, confirmPassword, otp} = req.body;

        if (!email || !password || !confirmPassword || !otp) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth Server error, On forgot password all fields are required to fill"}
                )
        }

        if (password !== confirmPassword) {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth Server error, password and confirmPassword must be the same"}
                )
        }

        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({success: false, message: "Auth Server Error, Invalid email format"});
        }

        const existingUser = await User.findOne({email})
        if (!existingUser) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth Server Error, User related to this user is not found"}
                );
        }

        const response = await OTP
            .find({email})
            .sort({createdAt: -1})
            .limit(1)

        if (response.length === 0) {
            return res
                .status(400)
                .json({success: false, message: "Auth Server error, The OTP is not valid"})
        } else if (otp !== response[0].otp) {
            return res
                .status(400)
                .json({success: false, message: "Auth Server error, The OTP is not valid"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const changePassword = await User.findOneAndUpdate({
            email
        }, {password: hashedPassword})

        //TODO: to remove changePassword in response
        return res
            .status(200)
            .json(
                {success: true, message: "Auth server, Password Reset successfull"}
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server error, Forgot passwrod controler error"}
            )
    }
}