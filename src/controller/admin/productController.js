const Product = require("../../models/productModel");


const addProduct = async(req,res)=>{
    const { title, parentCommission, grandParentCommission, price, description } = req.body;
    try {
      const product = new Product({ title, parentCommission, grandParentCommission, price, description });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

const updateProduct=(req,res)=>{
    const {title, image} = req.body
}

module.exports = {addProduct, updateProduct}