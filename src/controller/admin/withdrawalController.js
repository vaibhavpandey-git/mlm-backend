const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");


const withdrawalRequests= async (req,res)=>{
    try {
      const requests = await Withdrawal.find({paymentStatus: "Pending"});
      if(!requests) return res.status(404).json({message: "Requests not found"});

      res.status(200).json({success: true, requests: requests});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}



const paidAcknowledgement = async (req,res)=>{
    const { userId, withdrawalId, UTR } = req.body

    try {
      const withdrawal = await Withdrawal.findById(withdrawalId);
      const user = await User.findById(userId);

      if(!withdrawal || !user) return res.status(404).json({message: "Withdrawal request or User not found"});
      if(!user.balance >= withdrawal.requestedAmount || !withdrawal.paymentStatus == "Pending") return res.status(200).json({message: "Can't send acknowledgement"});
      if(!withdrawal.requestedAmount >= 1000 || !UTR) return res.status(200).json({message: "Requested Amount is less than minimum withdrawalable amount or UTR not present"});

      user.balance -= withdrawal.requestedAmount;
      withdrawal.paymentDetails = {
        UTR: UTR,
        paidOn: Date.now()
      };
      withdrawal.paymentStatus = "Completed";
      await withdrawal.save();
      await user.save();
      res.status(200).json({message: "Ackowledgement sent succuessfully"});
    } catch (error) {
      res.status(500).json({message: error.message})
    }
 }

 const completedWithdrawal=async(req,res)=>{
try {
  const withdrawal= await Withdrawal.find({paymentStatus: "Success"})
  res.status(200).json({success: true, withdrawal})
  
} catch (error) {
  res.status(500).json({message: error.message})
}
 }

 module.exports = {paidAcknowledgement, withdrawalRequests, completedWithdrawal}