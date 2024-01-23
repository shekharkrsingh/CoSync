const User = require("../models/User");

exports.autoLogin = async (req, res) => {
    try {
        const {id} = req.user;
        const user = await User.findById(id);

        if (!user) {
            return res
                .status(400)
                .json(
                    {success: false, message: "Auth server Error, user not found for this token. Please login."}
                );
        }

        user.password = '';

        console.log(user);

        return res
            .status(200)
            .json(
                {success: true, message: "Auth server response, User Auto Login Successful", user}
            );
    } catch (error) {
        console.error(error.message);
        return res
            .status(500)
            .json({success: false, message: "Auth Server Error, Auto Login Failed"});
    }
};
