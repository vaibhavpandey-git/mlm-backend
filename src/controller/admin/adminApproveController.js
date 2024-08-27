const Order = require("../../models/orderModel");
const Payment = require("../../models/paymentModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");

const approveOrder = async(req,res)=>{
    const { paymentId } = req.query;
    try {
        const payment = await Payment.findById(paymentId);

        const productId = payment.productId;
        if(product.isActive == false) return res.status(200).json({message: "Product is not active, can't buy"});

        const userId = payment.userId;
        const user = await User.findById(userId);

        const product = await Product.findById(productId);
        if(!user || !product || !payment) {return res.status(200).json({message:'User or Product not found'})};

        if(!user.canBuy) return res.status(200).json({message: "User can't buy product as he has an active product with incomplete cycle"});

        const order = new Order({userId,productId,paymentId});
        user.products.push({orderId: order._id,productId: productId, isActive: true})
        user.canBuy = false;
        user.canRefer = true;
        user.investment += payment.amount;

        if(payment.tempParent) user.tempParent = payment.tempParent;

        await order.save();
        await user.save();
        payment.paymentStatus = 'Success';
        if(user.tempParent) await applyReferral(refCode, order._id, user, product);
        Payment.save();
        res.status(201).json({message: "Purchased successfully"})

    } catch(error){
        console.error('Error while order: ', error);
        res.status(500).json({message: "Internal server error",error: error.message});
    }
}

async function applyReferral(refCode, orderId, user, product){
    const parent = await User.findOne({refCode:refCode});
    const canBeReferred = await canReferred(parent,user)
    if(!canBeReferred) return;
    const referralsLength = parent.products.at(-1).referrals.length;
    parent.products.at(-1).referrals.push({userId: user._id, orderId});
    user.products.at(-1).parentId = parent._id;
    if(referralsLength == 2) parent.canRefer = false;
    await commissionDistribution(parent, product,user._id);
    parent.products.at(-1).allRefs.push(user._id);
    await parent.save();
    await user.save();
}


const commissionDistribution = async (parent, product,userId)=>{
    parent.balance += product.price * product.parentCommission;
    if(parent.products.at(-1).parentId){
        const grandParent = await User.findById(parent.products.at(-1).parentId);
        grandParent.balance += product.price * product.grandParentCommission;
        await parent.save()
        const isCompleted = await isCycleCompleted(grandParent);
        if(isCompleted){
            grandParent.canBuy = true;
            grandParent.products.at(-1).isActive = false;
        }
        grandParent.products.at(-1).allRefs.push(userId);
        await grandParent.save();
    }
}

//checking array to find a match
const canReferred = async (parent, user) => {
    if(!parent?.canRefer) return false;
    const activeProduct = parent.products.at(-1); 
    const foundMatch = activeProduct.allRefs.find((ref)=> ref == user._id);
    if(foundMatch) return false;

    if(!foundMatch && activeProduct.parentId){
        const grandParent = await User.findById(parent.products.at(-1).parentId);
        const activeProduct = grandParent.products.at(-1);
        const foundMatch = activeProduct.allRefs.find((ref)=> ref == user._id);
        if(foundMatch) {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}


const isCycleCompleted = async (user) => {
    const activeProduct = user.products.at(-1);
    const referrals = activeProduct.referrals;
    if(referrals.length < 3) return false;
    for(let i = 0; i < referrals.length; i++){
        const child = await User.findById(referrals[i].userId);
        const activeProduct = child.products.find((product) => {
            return product.orderId === referrals[i].orderId;
        });
        const childReferrals = activeProduct.referrals;
        if(childReferrals.length < 3) return false;
    }
    return true;
}


const paidAcknowledgement = async (req,res)=>{
    const { userId, withdrawalId, UTR } = req.body

    try {
      const withdrawal = await Withdrawal.findById(withdrawalId);
      const user = await User.findById(userId);

      if(!withdrawal || !user) return res.status(200).json({message: "Withdrawal request or User not found"});
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


 const approveKyc= async(req,res)=>{
    try {
        const userId = req.query;
        const user = await User.findById(userId);
    
        if (!user) return res.status(200).json({ error: 'User not found' });
    
        if (user.kycDetails.kycStatus !== 'Pending') return res.status(200).json({ error: 'KYC is already approved or rejected' });
    
        user.kycDetails.kycStatus = 'Verified';
        await user.save();
    
        res.status(200).json({ message: 'KYC approved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
 }

module.exports = {approveOrder, paidAcknowledgement, approveKyc}