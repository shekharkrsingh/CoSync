const User = require("../models/User");

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');

        const {id} = req.user;

        return res
            .status(200)
            .json({success: true, message: "User successfully logged out"});

    } catch (error) {
        console.error(error.message);
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server error, Logout Failed. Internal Server Error"}
            );
    }
}