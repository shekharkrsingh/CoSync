const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth server Error, Email and password are required for login"}
                );
        }

        const user = await User.findOne({email});

        if (!user) {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth server Error, User is not registered with us. Please sign up to continue"}
                );
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                    email: user.email,
                    id: user._id
                },
                process.env.AUTH_JWT_SECRET,
                {expiresIn: '24h'} // Corrected token expiration format
            );

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res
                .cookie("token", token, options)
                .status(200)
                .json({success: true, token, user, message: "User Login Success"});
        } else {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth Server Error, Login Password is incorrect"}
                );
        }

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server Error, Login Failure. Please try again"}
            );
    }
};
