const Product = require("../models/productModel");


//Adding product

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



//buying product for user after verifying payment

const buyProduct = (req,res)=>{
    const {productId, userId, referralCode} = req.body
    try {
        const user = User.findById(userId);
        const product = Product.findById(productId);

        if(!user || !product) {res.status(404).send('User or Product not found')}
        if(user.canBuy){
            
        }
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

module.exports = {addProduct,buyProduct}