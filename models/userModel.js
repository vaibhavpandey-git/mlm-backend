const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String },
    phone: {type: Number, required: true, unique: true},
    tempParent: {type: String},
    products: [
      {
        parentId: {type: String},
        orderId: {type: String},
        productId: {type: String},
        isActive: {type: Boolean},
        referrals: []
      }
    ],
    canBuy: {type: Boolean, default: true},

    refCode: {type: String, required: true, unique: true},
    canRefer: {type: Boolean, default: false},

    investment: {type: Number, default: 0},
    balance: { type: Number, default: 0 }
},{timestamps: true})

const User = mongoose.model('user', userSchema)
module.exports = User