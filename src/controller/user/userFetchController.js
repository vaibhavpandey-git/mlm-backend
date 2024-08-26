const Payment = require("../../models/paymentModel");
const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");

const userWithdrawals=async(req,res)=>{
    const {userId} = req.user
    try {
        const withdrawals = await Withdrawal.find({userId: userId});
        if(withdrawals.length) return res.status(404).json({message: "No withdrawals found"});

        return res.status(200).json(withdrawals);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


const userDetails= async(req,res)=>{
    const {userId} = req.user;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});
        if(user.personalDetails?.profileImage){
            const fileUrl = `${req.protocol}://${req.get('host')}/${user.personalDetails.profileImage}`;
            user.personalDetails.profileImage = fileUrl;
        }
        delete user.password
        delete user.tempParent
        delete user.canRefer
        delete user.token
        return res.status(200).json(user);
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const payments= async()=>{
    const {userId} = req.user;
    try {
        const payments = await Payment.find({userId: userId});
        if(payments.length == 0) return res.status(404).json({message: "No record found"});
        for(let i=0; payments.length; i++){
            delete payments[i].tempParent
            delete payments[i].paymentProof
        }

        res.status(200).json(payments)
    } catch (error) {

    }
}
module.exports = {userWithdrawals, userDetails, payments};