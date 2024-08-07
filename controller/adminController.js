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
    
                    if(parent.canRefer){
                        // using switch for length of array 1, 2 & 3
                        // when length is 2 simply approve the buy and update parent with {canRefer: false}
                        switch(referralsLength){
                            case 1: {
                                user.products.push({parentId: parent._id, orderId: order._id,productId: productId, isActive: true, referrals: [] })
                                user.canBuy = false
                                user.canRefer = true
                                user.investment += payment.amount
                                parent.products[productsLength - 1].referrals.push(userId)
                                await order.save()
                                await user.save()
                                await parent.save()
                                res.redirect('/v1/api/admin/commissiondistribution')
                                break
                            }
                            case 2: {
                                user.products.push({parentId: parent._id, orderId: order._id,productId: productId, isActive: true, referrals: [] })
                                user.canBuy = false
                                user.canRefer = true
                                user.investment += payment.amount
                                parent.canRefer = false
                                parent.products[productsLength - 1].referrals.push(userId)
                                await order.save()
                                await user.save()
                                await parent.save()
                                res.redirect('/v1/api/admin/commissiondistribution')
                                break
                            }
                            default: {
                                user.products.push({parentId: "", orderId: order._id,productId: productId, isActive: true, referrals: [] })
                                user.canBuy = false
                                user.canRefer = true
                                user.investment += payment.amount
                                await order.save()
                                await user.save()
                                // res.redirect('/v1/api/admin/cyclecheck')
                                return res.status(201).json({message: "Product Purchased successfully"})
                            }
                        }
                    }
                    else{
                        user.products.push({parentId: "", orderId: order._id,productId: productId, isActive: true, referrals: [] })
                        user.canBuy = false
                        user.canRefer = true
                        user.investment += payment.amount
                        await order.save()
                        await user.save()
                        // res.redirect('/v1/api/admin/cyclecheck')
                        return res.status(201).json({message: "Product Purchased successfully"})
                    }
                }
                else{
                    user.products.push({parentId: "", orderId: order._id,productId: productId, isActive: true, referrals: [] })
                    user.canBuy = false
                    user.canRefer = true
                    user.investment += payment.amount
                    await order.save()
                    await user.save()
                    // res.redirect('/v1/api/admin/cyclecheck')
                    return res.status(201).json({message: "Product Purchased successfully"})
                }
            }
            else{
                user.products.push({parentId: "", orderId: order._id,productId: productId, isActive: true, referrals: [] })
                user.canBuy = false
                user.canRefer = true
                user.investment += payment.amount
                await order.save()
                await user.save()
                // res.redirect('/v1/api/admin/cyclecheck')
                return res.status(201).json({message: "Product Purchased successfully"})
            }
        }
        else{
            return res.status(200).json({message: "User can't buy product as he has an active product with incomplete cycle"})
        }
    } catch (error) {
        return res.status(500).send({message: error.message,from: "buyProduct API"})
    }
}

// commission distribution
const commissionDistribution= async(req,res)=>{
    const {userId} = req.body
    try {
        const user = await User.findById(userId)
        if(!user) {return res.status(404).json({message: "User not found while commission distribution"})}
        
        const productIndex = user.products.length;
        if(user.products[productIndex - 1].isActive && user.products[productIndex -1].parentId){
            const parent = await User.findById(user.products[productIndex - 1].parentId)
            const product = await Product.findById(user.products[productIndex-1].productId)
            console.log(product)
            parent.balance += product.price * product.parentCommission;

            const parentProductIndex = parent.products.length
            if(parent.products[parentProductIndex-1].isActive && parent.products[parentProductIndex-1].parentId){
                const grandParent = await User.findById(parent.products[parentProductIndex-1].parentId)
                grandParent.balance += product.price * product.grandParentCommission
                await parent.save()
                await grandParent.save()
                // res.redirect('/v1/api/admin/cyclecheck')
                res.status(200).json({message: "commission to parent and grandparent distributed successfully"})
            }
            else{
                await parent.save()
                // res.redirect('/v1/api/admin/cyclecheck')
                res.status(200).json({message: "commission to parent distributed successfully"})
            }
            
        }
        else{
            return res.status(400).json({message: "Purchase successful but User can not distribute commission / user don't has parent"})
        }
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


//////////////////////////////////
//checking cycle of grand parent//
//////////////////////////////////
// const cycleCkeck= async(req,res)=>{
//     const {userId} = req.body

//     try {
//         const user = await User.findById(userId)

//         console.log("user from check cycle",user)

//         if(!user) {return res.status(404).json({message: "User not found while cycle check"})}
//         const userProductIndex = user.products.length
//         if(user.products[userProductIndex -1].parentId){
//             const parent = await User.findById(user.products[userProductIndex-1].parentId)

//             console.log("parent from check cycle",parent)

//             if(!parent) {return res.status(404).json({message: "Parent not found while checking cycle"})}
//             const parentProductIndex = parent.products.length
//             if(parent.products[parentProductIndex -1].parentId){
//                 const grandParent = await User.findById(parent.products[parentProductIndex -1].parentId)

//                 console.log("grandParent",grandParent)

//                 if(!grandParent) {return res.status(404).json({message: "No grand parent found while checking cycle"})}

//                 const grandParentProductIndex = grandParent.products.length

//                 if(grandParent.products[grandParentProductIndex -1].referrals.length == 3){

//                     const firstChild = await User.findById(grandParent.products[grandParentProductIndex -1].referrals[0])

//                     const firstChildProductIndex = firstChild.products.length

//                     if(firstChild.products[firstChildProductIndex -1].referrals.length == 3){

//                         const secondChild = await User.findById(grandParent.products[grandParentProductIndex -1].referrals[1])

//                         const secondChildProductIndex = secondChild.products.length

//                         if(secondChild.products[secondChildProductIndex -1].referrals.length == 3){

//                             const thirdChild = await User.findById(grandParent.products[grandParentProductIndex -1].referrals[2])

//                             const thirdChildProductIndex = thirdChild.products.length

//                             if(thirdChild.products[thirdChildProductIndex -1].referrals.length == 3){

//                                 //to deactivate user (grandParent)
//                                 grandParent.canRefer = false
//                                 grandParent.canBuy = true
//                                 grandParent.tempParent = ""
//                                 grandParent.products[grandParentProductIndex -1].isActive = false
//                                 await grandParent.save()
//                                 return res.status(200).json({message: "Purchased Successfully", cycle: "Completed"})

//                             }
//                             else{
//                                 return res.status(200).json({message: "Purchased Successfully", cycle: "Not completed"})
//                             }
//                         }
//                         else{
//                             return res.status(200).json({message: "Purchased Successfully", cycle: "Not completed"})
//                         }
//                     }
//                     else{
//                         return res.status(200).json({message: "Purchased Successfully", cycle: "Not completed"})
//                     }
//                 }
//                 else{
//                     return res.status(200).json({message: "Purchased Successfully",cycle: "Not Completed" })
//                 }
//             }
//             else{
//                 return res.status(200).json({message: "Purchased successfully", cycle: "Not completed as no grandparent found"})
//             }
//         }
//         else{
//             return res.status(200).json({message: "Purchased successfully", cycle: "Not completed as no parent found"})
//         }


//     } catch (error) {
//         return res.status(400).json({message: error.message})
//     }
// }

module.exports = { addProduct, buyProduct, commissionDistribution};