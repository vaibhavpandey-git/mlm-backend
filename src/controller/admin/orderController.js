const Order = require("../../models/orderModel");
const Payment = require("../../models/paymentModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");

//list of payment requests to start a cycle from user (to buy product)
const paymentRequests= async (req,res)=>{
    try {
        const payments = await Payment.find({paymentStatus: "Pending", isRejected: false});
        if(!payments) return res.json({message: "No Payments Available"});

        res.status(200).json({success: true, payments: payments});

    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}



const approveOrder = async(req,res)=>{
    const {productId, userId, refCode, paymentId} = req.body
    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        const payment = await Payment.findById(paymentId);

        if(!user || !product || !payment) {return res.status(404).send('User or Product not found')};

        if(!user.canBuy) return res.status(200).json({message: "User can't buy product as he has an active product with incomplete cycle"});

        const order = new Order({userId,productId,paymentId});
        user.products.push({orderId: order._id,productId: productId, isActive: true})
        user.canBuy = false;
        user.canRefer = true;
        user.investment += payment.amount;

        await order.save();
        await user.save();
        if(refCode) await applyReferral(refCode, order._id, user, product);
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

const canReferred = async (parent, user) => {
    if(!parent?.canRefer) return false;
    const activeProduct = parent.products.at(-1);
    // const referrals = activeProduct.referrals;
    // const userId = user._id
    // for(let i = 0; i < referrals.length; i++){
    //     if(referrals[i].userId === userId) return false;
    // }
    // if(activeProduct.parentId){
    //     const grandParent = await User.findById(parent.products.at(-1).parentId);
    //     const referrals = grandParent.products.at(-1).referrals;
    //     for(let i = 0; i < referrals.length; i++){
    //         if(referrals[i].userId === userId) return false;
    //         const user = await User.findById(referrals[i].userId);
    //         const activeProduct = user.products.at(-1);
    //         const childReferrals = activeProduct.referrals;
    //         for(let i = 0; i < childReferrals.length; i++){
    //             if(childReferrals[i].userId === userId) return false;
    //         }
    //     }
    // } 
    
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



const approvedOrders= async(req,res)=>{
    const {orderId, userId} = req.query
    try {
        if(orderId){
            const order = await Order.findById(orderId);
            if(!order) return res.status(404).json({message: "Order not found"});
            return res.status(200).json(order);
        }
        else if(userId){
            const orders = await Order.find({userId: userId});
            if(orders.length == 0) return res.status(404).json({message: "No order found for this user"})
            return res.status(200).json(orders);
        }
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports = {paymentRequests, approveOrder, approvedOrders}
