const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    userId: {type: String, required: true},
    productId: {type: String, required: true},
    amount: {type: Number},
    paymentProof: {type: String, default: "to be completed"},
    date: {type: Date, default: Date.now}
},{timestamps: true})

const Payment = mongoose.model('payment',paymentSchema)

module.exports = Payment