const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try {
        const {firstName, lastName} = req.body;
        const {id} = req.user;

        if (!firstName && !lastName) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Auth server error, Specify what you want to change (firstName, lastName, or bo" +
                                "th)"
                });
        }

        // Create an object to hold the fields that need to be updated
        const updateFields = {};
        if (firstName) {
            updateFields.firstName = firstName;
        }
        if (lastName) {
            updateFields.lastName = lastName;
        }

        const response = await User.findByIdAndUpdate(id, updateFields, {new: true});

        // Check if the user with the given id is not found
        if (!response) {
            return res
                .status(404)
                .json({success: false, message: "Auth server error, User not found"});
        }

        console.log(response);

        return res
            .status(200)
            .json(
                {success: true, message: "Profile details updated successfully", user: response}
            );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(
                {success: false, message: "Auth Server error, updateProfile controller error"}
            );
    }
};
