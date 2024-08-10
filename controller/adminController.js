const Product = require("../models/productModel");
const User = require("../models/userModel");
const Withdrawal = require("../models/withdrawalModel");


//Adding product
const addProduct = async(req,res)=>{
    const { title, parentCommission, grandParentCommission, price, description } = req.body;
    try {
      const product = new Product({ title, parentCommission, grandParentCommission, price, description });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
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
module.exports = { addProduct, paidAcknowledgement };