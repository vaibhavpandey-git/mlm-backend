const User = require("../../models/userModel");

const fetchActiveUsers= async (req,res)=>{
    try {
        const users = await User.find();
        if(!users) return res.status(404).json({message: "No User Found"});
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {fetchActiveUsers};