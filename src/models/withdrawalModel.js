const mongoose = require('mongoose')

const withdrawalSchema = mongoose.Schema({
    userId: {type: String, required: true},
    paymentStatus: {type: String, default: "Pending"},
    requestedAmount: {type: Number},
    requestedOn: {type: Date, default: Date.now()},
    bankDetails: {
        bankName: {type: String},
        accountNumber: {type: Number},
        accountHolder: {type: String},
        bankIFSC: {type: String},
        UPI: {type: String}
    },
    paymentDetails: {
        UTR: {type: Number},
        paidOn: {type: Date}
    }
},{timestamps: true})

const Withdrawal = mongoose.model('withdrawal', withdrawalSchema);

module.exports = Withdrawal