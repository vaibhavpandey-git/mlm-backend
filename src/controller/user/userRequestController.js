const Payment = require("../../models/paymentModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");

const payment= async(req,res)=>{
    const {userId} = req.user;
    const { productId, referralCode } = req.body;
    const file = req.file;

    try {
        const user = await User.findById(userId);
        const pendingPayment = await Payment.findOne({userId: userId, paymentStatus: 'Pending'});
        if(pendingPayment) return res.status(200).json({message: "Can not request order as previous payment is pending"});
        const product = Product.findById(productId);
        if(!product) return res.status(200).json({message: "Product not found"});

        const amount = product.price;
        const paymentProof = file.path;

        const payment = new Payment({
          userId,
          productId,
          userName: user.personalDetails.name,
          userPhone: user.phone,
          amount,
          paymentProof,
          tempParent: referralCode,
          paymentStatus: "Pending",
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}




const withdrawalRequest= async (req,res)=>{
    const {userId} = req.user;
    const { requestedAmount } = req.body;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(200).send({message: "User not found while requesting withdrawal request"});

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