const Payment = require("../models/paymentModel")
const User = require("../models/userModel")
const Withdrawal = require("../models/withdrawalModel");
const sendOTP = require("../utility/sendOtp");

const payment= async(req,res)=>{
    const {userId, productId, amount, paymentProof} = req.body;

    try {
        const pendingPayment = await Payment.findOne({userId: userId, paymentStatus: 'Pending'});
        console.log(pendingPayment)
        if(pendingPayment) return res.status(400).json({message: "Can not request order as previous payment is pending"});

        const payment = new Payment({userId,productId,amount, paymentProof});
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}


const withdrawalRequest= async (req,res)=>{
    const {userId, requestedAmount } = req.body;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).send({message: "User not found while requesting withdrawal request"});

        const canRequest = async ()=>{
            if(requestedAmount <= user.balance && requestedAmount >= 1000){
                const requests = await Withdrawal.find({userId: userId});
                if(!requests) return true;
                const foundPending = requests.find((request) => request.paymentStatus == "Pending");
                if(foundPending) return false;
                return true;
            }
            else return false;
        }
        if(! await canRequest()) return res.status(200).json({message: "User can not request withdrawal for now"});
        const bankDetails = user.bankDetails;
        const withdrawal = new Withdrawal({userId, requestedAmount, bankDetails});
        await withdrawal.save()

        return res.status(201).json({message: `requested withdrawal of ${requestedAmount} rupees`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const updateUserDetails= async (req,res)=>{
    const userId = req.params;
    const { personalDetails, bankDetails } = req.body;

    try {
        const user = await User.findById(userId);
        if(personalDetails && !bankDetails){
            user.personalDetails = personalDetails;
        }
        else if(!personalDetails && bankDetails){
            user.bankDetails = bankDetails;
        }
        
        user.save();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

const userDetails= async (req,res)=>{
    const {userId} = req.body;

    try {
        const user = await User.findById(userId);
        if(!foundUser) return res.status(404).json({success: false, message: "User not found"});

        const memberTree = [{}];

        const treeGenerate =(user)=>{
           
        }

        return res.status(200).json({
            phone: user.phone,
            personalDetails: user.personalDetails,
            kycDetails: user.kycDetails,
            bankDetails: user.bankDetails,
            totalInvestment: user.investment,
            balance: user.balance
        });
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const testOtp= async (req,res)=>{
    const phoneNumber = '+919354716138';
    const otp = await sendOTP(phoneNumber);

    res.status(200).json({SENT_OTP: otp});
}



module.exports = {payment, withdrawalRequest, updateUserDetails, userDetails, testOtp}