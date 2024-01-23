const User = require("../models/User");
const validator = require('validator');
const bcrypt = require('bcrypt');
const OTP = require("../models/OTP");

exports.updateEmail = async (req, res) => {
    try {
        const {newEmail, password, otp} = req.body;
        const {id} = req.user;

        if (!newEmail || !password) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth Server error, For updating email, newEmail and password are required"}
                );
        }

        if (!validator.isEmail(newEmail)) {
            return res
                .status(400)
                .json({success: false, message: "Auth Server Error, Invalid email format"});
        }

        const user = await User.findById(id);

        const validatePasswords = await bcrypt.compare(password, user.password);

        if (!validatePasswords) {
            return res
                .status(401)
                .json({success: false, message: "Auth Server error, Password didn't match"});
        }

        const existingUser = await User.findOne({email: newEmail});

        if (existingUser) {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth Server error, An account with this email already exists"}
                );
        }

        const response = await OTP
            .find({email: newEmail})
            .sort({createdAt: -1})
            .limit(1);

        if (response.length === 0 || otp !== response[0].otp) {
            return res
                .status(400)
                .json({success: false, message: "Auth server Error, The OTP is not valid"});
        }

        const updated = await User.findByIdAndUpdate(id, {email: newEmail}); // Specify the field to update

        return res
            .status(200)
            .json(
                {success: true, message: "Auth server response, email updated successfully", updated}
            );

    } catch (error) {
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server error, update Email controller error"}
            );
    }
};
