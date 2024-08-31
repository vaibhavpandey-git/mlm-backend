const Payment = require("../../models/paymentModel");
const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");

const userWithdrawals=async(req,res)=>{
    const {userId} = req.user
    try {
        const withdrawals = await Withdrawal.find({userId: userId});
        if(withdrawals.length == 0) return res.status(200).json({message: "No withdrawals found"});

        return res.status(200).json({data: withdrawals, message: "Withdrawal history fetched successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


const userDetails= async(req,res)=>{
    const {userId} = req.user;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(200).json({message: "User not found"});
        if(user.personalDetails?.profileImage){
            const fileUrl = `${req.protocol}://${req.get('host')}/${user.personalDetails.profileImage}`;
            user.personalDetails.profileImage = fileUrl;
        }
        delete user.password
        delete user.tempParent
        delete user.canRefer
        delete user.token
        return res.status(200).json({data: user, message: "User details fetched successfully"});
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const payments= async(req,res)=>{
    const {userId} = req.user;
    try {
        const payments = await Payment.find({userId: userId});
        if(payments.length == 0) return res.status(200).json({message: "No record found"});

        for(let i=0; i<payments.length; i++){
            // let fileUrl = `${req.protocol}://${req.get('host')}/${products[i].image}`;
            const fileUrl = 'https://picsum.photos/200/300';
            payments[i].paymentProof = fileUrl;
        }

        res.status(200).json({data: payments, message: "successfully fetched"});
        res.status(200).json(payments)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const confirmedOrders = async(req,res)=>{
    const {userId} = req.user
    try {
        const user = await User.findById(userId);
        let products = [];
        user.products.map((product)=>{

        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports = {userWithdrawals, userDetails, payments};