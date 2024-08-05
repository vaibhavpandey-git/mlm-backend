const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;