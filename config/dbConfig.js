const mongoose = require('mongoose')
require('dotenv').config()


const dbConnect =()=> mongoose.connect(process.env.MONGO_URL).then(console.log("Database connection got established"))

module.exports = dbConnect