const express = require('express');
const dbConnect = require('./config/dbConfig');
const cors = require('cors');
const router = require('./routes');

const app = express();
require('dotenv').config();
app.use(express.urlencoded({extended: false}));

//making uploads public
app.use('/uploads', express.static('uploads'));

dbConnect();
app.get('/',(req,res)=>{
    res.send(`Server is running on PORT ${process.env.PORT}`);
});

//middlewares
app.use(express.json());
app.use(cors())


//auth, admin & user Routes
app.use('/v1/api',router);

// app.listen(process.env.PORT,()=>{
//     console.log(`Server running on PORT ${process.env.PORT}`);
// });

module.exports = app;