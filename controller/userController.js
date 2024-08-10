const Payment = require("../models/paymentModel")
const User = require("../models/userModel")
const Withdrawal = require("../models/withdrawalModel")

const payment= async(req,res)=>{
    const {userId, productId, amount} = req.body

    try {
        const payment = new Payment({userId,productId,amount})
        await payment.save()
        res.status(201).json(payment)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}


const withdrawalRequest= async (req,res)=>{
    const {userId, requestedAmount } = req.body
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


module.exports = {payment, withdrawalRequest}