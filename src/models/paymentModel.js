const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    userId: {type: String, required: true},
    userName: {type: String},
    userPhone: {type: String},
    productId: {type: String, required: true},
    tempParent: {type: String},
    amount: {type: Number},
    paymentStatus: {type: String, enum: ['Pending', 'Rejected', 'Success']},
    paymentProof: {type: String},
    date: {type: Date, default: Date.now}
},{timestamps: true})

const Payment = mongoose.model('payment',paymentSchema)

module.exports = Payment