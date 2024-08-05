const express = require('express')
const authRoute = require('./routes/authRoutes')
const dbConnect = require('./config/dbConfig')
const adminRoute = require('./routes/adminRoutes')
const app = express()
require('dotenv').config()

dbConnect()
app.get('/',(req,res)=>{
    res.send(`Server is running on PORT ${process.env.PORT}`)
})

//middlewares
app.use(express.json());


//auth, admin & user Routes
app.use('/v1/api/auth',authRoute)
app.use('/v1/api/admin', adminRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on PORT ${process.env.PORT}`)
})