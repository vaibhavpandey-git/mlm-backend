const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  productId: { type: String, required: true },
  paymentId:{type: String, required: true, unique: true},
  quantity: { type: Number },
  total:{type: Number},
  date: { type: Date, default: Date.now }
},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;