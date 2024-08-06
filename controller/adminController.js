const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");


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



///////////////////////////////////////////////////
//buying product for user after verifying payment//
///////////////////////////////////////////////////
const buyProduct = async(req,res)=>{
    const {productId, userId, refCode, paymentId} = req.body
    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        const payment = await Payment.findById(paymentId)

        if(!user || !product || !payment) {return res.status(404).send('User or Product not found')}
        
        if(user.canBuy){
            //if user can buy create order
            const order = new Order({userId,productId,paymentId})
            
            if(refCode){
                const parent = await User.findOne({refCode: refCode})
                if(parent){
                    const productsLength = parent.products.length
                    const referralsLength = parent.products[productsLength - 1].referrals.length
    
                    if(referralsLength < 3){
                        user.products.push({parentId: parent._id, orderId: order._id, isActive: true, referrals: [] })
                        user.canBuy = false
                        user.investment += payment.amount
                        parent.products[productsLength - 1].referrals.push(userId)
                        await order.save()
                        await user.save()
                        await parent.save()
                        console.log("referral se khareeda")

                        // return res.status(201).json({message: "Product Purchased successfully and parent updated"})
                    }
                    else{
                        user.products.push({parentId: "", orderId: order._id, isActive: true, referrals: [] })
                        user.canBuy = false
                        user.investment += payment.amount
                        await order.save()
                        await user.save()
                        console.log("3 se jyada the")
                        return res.status(201).json({message: "Product Purchased successfully"})
                    }
                }
                else{
                    user.products.push({parentId: "", orderId: order._id, isActive: true, referrals: [] })
                    user.canBuy = false
                    user.investment += payment.amount
                    await order.save()
                    await user.save()
                    console.log("parent nhi mila")
                    return res.status(201).json({message: "Product Purchased successfully"})
                }
            }
            else{
                user.products.push({parentId: "", orderId: order._id, isActive: true, referrals: [] })
                user.canBuy = false
                user.investment += payment.amount
                await order.save()
                await user.save()
                console.log("referral recieve nhi hua")
                return res.status(201).json({message: "Product Purchased successfully"})
            }
        }
        else{
            return res.status(200).json({message: "User can't buy product as he has allready active product and completed the cycle"})
        }
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}

// commission distribution
const commissionDistribution= async(req,res)=>{
    const {userId} = req.body
    try {
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({message: "User not found while commission distribution"})
        
        
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const cycleCkeck=(req,res)=>{

}

module.exports = { addProduct, buyProduct, commissionDistribution , cycleCkeck};