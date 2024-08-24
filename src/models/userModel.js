const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    role: {type: String, enum: ["admin", "user"]},
    countryCode: {type: String, default: '+91'},
    phone: {type: String, required: true, unique: true},
    password: {type: String},
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
      kycStatus: {type: String, enum: ['Pending', 'Rejected', 'Verified']},
      aadharNumber: {type: Number},
      panNumber: {type: Number},
      aadharProof: {type: String},
      panProof: {type: String}
    },

    tempParent: {type: String},

    products: [
      {
        allRefs: [String],
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
    balance: { type: Number, default: 0 },
    token: {type: String}
},{timestamps: true})

const User = mongoose.model('user', userSchema)
module.exports = User