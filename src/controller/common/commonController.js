const Product = require("../../models/productModel");
const User = require("../../models/userModel");

const getProduct= async (req,res)=>{
    const {productId} = req.body;
    try {

        if(productId){
            const product = await Product.findById(productId);
            const fileUrl = `${req.protocol}://${req.get('host')}/${product.image}`;
            product.image = fileUrl;
            return res.status(200).json(product);
        }
        
        const products = await Product.find();

        for(let i=0; i<products.length; i++){
            let fileUrl = `${req.protocol}://${req.get('host')}/${products[i].image}`;
            products[i].image = fileUrl;
        }
        return res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
}



const updateDetails= async (req,res)=>{
    const userId = req.params;
    const { personalDetails, bankDetails } = req.body;

    try {
        const user = await User.findById(userId);
        if(personalDetails && !bankDetails){
            user.personalDetails = personalDetails;
        }
        else if(!personalDetails && bankDetails){
            user.bankDetails = bankDetails;
        }
        user.save();
        res.status(200).json({message: "Updated successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {getProduct, updateDetails}