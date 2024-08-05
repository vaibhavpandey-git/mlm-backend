const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    userId: {type: String, required: true},
    productId: {type: String, required: true},
    paymentProof: {type: String, required: true}
},{timestamps: true})

const Payment = mongoose.Model('payment',paymentSchema)

module.exports = Payment