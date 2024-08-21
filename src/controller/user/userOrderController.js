const User = require("../../models/userModel");

const orders= async(req,res)=>{
    const {orderId, userId} = req.body;
    try {
        if(orderId){

        }
        const userId = await User.findById(userId);
        const order = fin
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}