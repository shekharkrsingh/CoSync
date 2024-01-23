const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose
        .connect(process.env.AUTH_SERVER_DATABASE)
        .then(() => console.log("DB of CoSync auth connected successfully"))
        .catch((error) => {
            console.log('Issue in CoSync auth DB Connection');
            console.error(error);
            process.exit(1);
        })
    };