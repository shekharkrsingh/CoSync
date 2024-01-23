const OTP = require('../models/OTP');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator');

exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth Server Issue For SignUp all Field are Required"}
                );
        }

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth Server error Password and ConfirmPassword must be the same"}
                );
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Auth Server Error, Password must have at least one capital letter, one symbol," +
                                " and one numerical character, and be at least 8 characters long"
                });
        }

        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({success: false, message: "Auth Server Error, Invalid email format"});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth server error, User with this email already exists. Please try to login"}
                );
        }

        const response = await OTP
            .find({email})
            .sort({createdAt: -1})
            .limit(1);

        if (response.length === 0) {
            return res
                .status(400)
                .json({success: false, message: "Auth server Error, The OTP is not Valid"});
        } else if (otp !== response[0].otp) {
            return res
                .status(400)
                .json({success: false, message: "Auth Server Issue, The Otp is not valid"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create(
            {firstName, lastName, email, password: hashedPassword}
        );

        return res
            .status(200)
            .json(
                {success: true, message: "Auth Server, User registered Successfully"}
            );
    } catch (error) {
        console.error(error.message);
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server Error, Server is throwing error during signup"}
            );
    }
};
