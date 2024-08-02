const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: {type: Number, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    parentRefCode: {type: String},
    registeredUsers: [{
      userId: {type: String},
      paymentStatus: {type: String, default: "Pending"}
    }],
    products: [
      {
        parentId: {type: String},
        orderId: {type: String},
        isActive: {type: Boolean},
        referrals: []
      }
    ],
    payments: [],
    canBuy: {type: Boolean, default: true},
    referral: {
      refCode: {type: String, required: true, unique: true},
      canRefer: {type: Boolean, default: true}
    },
    investment: {type: Number, default: 0},
    balance: { type: Number, default: 0 }
})

const User = mongoose.model('user', userSchema)
module.exports = User