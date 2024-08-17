const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title:{type: String, required: true},
    price:{type: Number, required: true},
    image: {type: String},
    isActive: {type: Boolean, default: true},
    parentCommission:{type: Number, default:0},
    grandParentCommission: {type: Number, default:0},
    description: {type: String}
},{timestamps: true})

const Product = mongoose.model('product',productSchema);

module.exports = Product