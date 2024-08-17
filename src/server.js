const express = require('express');
const authRoute = require('./routes/authRoutes');
const dbConnect = require('./config/dbConfig');
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
require('dotenv').config();
app.use(express.urlencoded({extended: false}));

dbConnect();
app.get('/',(req,res)=>{
    res.send(`Server is running on PORT ${process.env.PORT}`);
});

//middlewares
app.use(express.json());
app.use(cors())


//auth, admin & user Routes
app.use('/v1/api/auth',authRoute);
app.use('/v1/api/admin', adminRoute);
app.use('/v1/api/user', userRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server running on PORT ${process.env.PORT}`);
});