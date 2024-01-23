const User = require("../models/User");
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const validatePasswords = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

exports.changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        const {id} = req.user;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth Server error, On change password all fields are required to fill"}
                );
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Auth Server Error, Password must have at least one capital letter, one symbol," +
                                " and one numerical character, and be at least 8 characters long"
                });
        }

        if (newPassword !== confirmNewPassword) {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth Server error, newPassword and confirmNewPassword must be the same"}
                );
        }

        const user = await User.findById(id);

        if (await validatePasswords(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            const updatedUser = await User.findByIdAndUpdate(
                id,
                {password: hashedPassword}
            );
        //Todo:- remove updatedUser from the resposne
            return res
                .status(200)
                .json(
                    {success: true,  message: "Auth server, Password Reset successfully"}
                );
        } else {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth server error, oldPassword is not correct. Please go for forgot password"}
                );
        }

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server error, Change password controller error"}
            );
    }
};
