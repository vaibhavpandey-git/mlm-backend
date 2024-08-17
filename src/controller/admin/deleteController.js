const User = require("../../models/userModel");

const deleteUser= async (req,res)=>{
    const {userId} = req.body;
    try {
        const user = await User.deleteOne({userId});
        if(!user) return res.status(404).json({message: "User not found"});
        res.status(200).json({message: "User deleted", deletedUser: user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteKyc=(req,res)=>{

}

module.exports = {deleteUser,deleteKyc}