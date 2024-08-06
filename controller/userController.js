const Payment = require("../models/paymentModel")

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

module.exports = payment