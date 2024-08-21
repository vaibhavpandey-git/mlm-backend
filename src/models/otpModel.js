const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  phone: { type: String, required: true },
  otpCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" },
});

const OTP = mongoose.model('otp',otpSchema);

module.exports = OTP;