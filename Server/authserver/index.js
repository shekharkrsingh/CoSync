const express = require('express');
require('dotenv').config()
const database = require('./config/database')
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/authRoutes")
const cors = require('cors');

const app = express();
database.connect();

const {AUTH_PORT} = process.env;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({success: true, message: 'This is Auth server of CoSync'})
})

app.use("/api/v1/auth", authRoutes)

app.listen(AUTH_PORT, () => {
    console.log(`Server is running at port: ${AUTH_PORT}`)
})