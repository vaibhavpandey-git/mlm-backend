const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    phone: {type: Number, required: true, unique: true},
    personalDetails:{
      name: {type: String},
      email: {type: String},
      dateOfBirth: {type: Date},
      gender: {type: String},
      profileImage: {type: String},
      address: {
        firstLine: {type: String},
        city: {type: String},
        pinCode: {type: Number},
        country: {type: String},
        state: {type: String},
      }
    },

    bankDetails: {
      bankName: {type: String, default: "State Bank of India"},
      accountNumber: {type: Number, default: 9876543255},
      accountHolder: {type: String, default: "Vaibhav Pandey"},
      bankIFSC: {type: String, default: "SBIN00045"},
      UPI: {type: String, default: "7827295033@paytm"}
    },

    kycDetails: {
      kycStatus: {type: String, default: "Pending"},
      aadharNumber: {type: Number},
      panNumber: {type: Number},
      aadharProof: {type: String},
      panProof: {type: String}
    },

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


    canBuy: {type: Boolean, default: true},
    
    refCode: {type: String, required: true, unique: true},
    canRefer: {type: Boolean, default: false},

    investment: {type: Number, default: 0},
    balance: { type: Number, default: 0 }
},{timestamps: true})

const User = mongoose.model('user', userSchema)
module.exports = User