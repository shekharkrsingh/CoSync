const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || (
            req.header("Authorization") || ""
        ).replace("Bearer ", "");

        if (!token) {
            return res
                .status(401)
                .json(
                    {success: false, message: "Auth Server Error, Token not found in auth middleware"}
                );
        }

        try {
            const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);

            if (error.name === 'TokenExpiredError') {
                return res
                    .status(401)
                    .json({success: false, message: "Auth Server Error, Token has expired"});
            } else if (error.name === 'JsonWebTokenError') {
                return res
                    .status(401)
                    .json({success: false, message: "Auth Server Error, Invalid token"});
            } else {
                return res
                    .status(401)
                    .json(
                        {success: false, message: "Auth Server Error, Token verification failed"}
                    );
            }
        }
    } catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({success: false, message: "Auth Server Error, Auth middleware error"});
    }
};
