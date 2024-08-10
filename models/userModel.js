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
        referrals: [{
          userId: {type: String},
          orderId: {type: String}
        }]
      }
    ],
    bankDetails: {
      bankName: {type: String, default: "State Bank"},
      accountNumber: {type: Number, default: 9876543255},
      accountHolder: {type: String, default: "Vaibhav Pandey"},
      bankIFSC: {type: String, default: "SBIN00045"},
      UPI: {type: String, default: "7827295033@paytm"}
    },
    canBuy: {type: Boolean, default: true},
    
    refCode: {type: String, required: true, unique: true},
    canRefer: {type: Boolean, default: false},

    investment: {type: Number, default: 0},
    balance: { type: Number, default: 0 }
},{timestamps: true})

const User = mongoose.model('user', userSchema)
module.exports = User