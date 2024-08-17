const Product = require("../../models/productModel");


const addProduct = async(req,res)=>{
    const { title, parentCommission, grandParentCommission,image, price, description } = req.body;
    try {
      const product = new Product({ title, parentCommission, grandParentCommission,image, price, description });
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

const getProduct= async (req,res)=>{
  const {productId} = req.body;
  try {
    if(productId){
      const product = await Product.findById(productId);
      return res.status(200).json({product});
    }
    const products = await Product.find();
    return res.status(200).json({products});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const updateProduct= async (req,res)=>{
    const {productId, title, image, isActive} = req.body;
    try {
      const product = await Product.findById(productId);
      product.title = title;
      product.image = image,
      product.isActive = isActive;
      await product.save();
      res.status(200).json({message: "Successfully Edited Product"});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}

module.exports = {addProduct, getProduct, updateProduct}