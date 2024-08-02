const express = require('express')
const authRoute = require('./routes/authRoutes')
const app = express()
require('dotenv').config()

app.get('/',(req,res)=>{
    res.send(`Server is running on PORT ${process.env.PORT}`)
})

//middlewares
app.use('/v1/api/auth',authRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on PORT ${process.env.PORT}`)
})