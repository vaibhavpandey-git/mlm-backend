const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const buyProduct = async(req,res)=>{
    const {productId, userId, refCode, paymentId} = req.body
    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);
        const payment = await Payment.findById(paymentId);

        if(!user || !product || !payment) {return res.status(404).send('User or Product not found')}

        if(user.canBuy){
            if(refCode){
                const parent = await User.findOne({refCode:refCode})
                if(parent && parent.canRefer){
                    const productsLength = parent.products.length
                    const parentReferralsLength = parent.products[productsLength -1].referrals.length
                    
                    switch(parentReferralsLength){
                        case 0:{
                            const order = new Order({userId,productId,paymentId})
                            user.products.push({parentId: parent._id, orderId: order._id,productId: productId, isActive: true, referrals: [] })
                            const objectId = user.products[productsLength -1]._id
                            user.canBuy = false
                            user.canRefer = true
                            user.investment += payment.amount
                            parent.products[productsLength - 1].referrals.push(userId,objectId)
                            await order.save()
                            await user.save()
                            await parent.save()
                            res.redirect('/v1/api/admin/commissiondistribution')
                            break
                        }
                        case 1:{
                            const order = new Order({userId,productId,paymentId})
                            user.products.push({parentId: parent._id, orderId: order._id,productId: productId, isActive: true})
                            const objectId = user.products[productsLength -1]._id
                            user.canBuy = false
                            user.canRefer = true
                            user.investment += payment.amount
                            parent.products[productsLength - 1].referrals.push(userId,objectId)
                            await order.save()
                            await user.save()
                            await parent.save()
                            res.redirect('/v1/api/admin/commissiondistribution')
                            break
                        }
                        case 2:{
                            const order = new Order({userId,productId,paymentId})
                            user.products.push({parentId: parent._id, orderId: order._id,productId: productId, isActive: true, referrals: [] })
                            user.canBuy = false
                            user.canRefer = true
                            user.investment += payment.amount
                            parent.canRefer = false
                            parent.products[productsLength - 1].referrals.push(userId)
                            await order.save()
                            await user.save()
                            await parent.save()
                            // res.redirect('/v1/api/admin/commissiondistribution')
                            break
                        }
                        case 3:{
                            buyProductWithoutRefCode()
                        }
                        default: {
                            buyProductWithoutRefCode()
                        }
                    }
                }
                else{
                    buyProductWithoutRefCode()
                }
            }
            else{
                buyProductWithoutRefCode()
            }
        }
        else{
            return res.status(200).json({message: "User can't buy product as he has an active product with incomplete cycle"})
        }

        
        //functions to execute buy product
        const buyProductWithoutRefCode= async()=>{
            const order = new Order({userId,productId,paymentId})
            user.products.push({orderId: order._id,productId: productId, isActive: true})
            user.canBuy = false
            user.canRefer = true
            user.investment += payment.amount
            await order.save()
            await user.save()
        }

    } catch (error) {
        return res.status(500).send({message: error.message,from: "buyProduct API"})
    }


}