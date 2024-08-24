const Product = require("../../models/productModel");


const addProduct = async(req,res)=>{
    const { title, parentCommission, grandParentCommission,image, price, description } = req.body;
    const file = req.file;
    try {
      parentCommission = parentCommission/100;
      grandParentCommission = grandParentCommission/100;
      const product = new Product({ title, parentCommission, grandParentCommission,image, price, description, image: file.path });
      await product.save();
      res.status(201).json({message: "Product added successfully"});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

module.exports = {addProduct}