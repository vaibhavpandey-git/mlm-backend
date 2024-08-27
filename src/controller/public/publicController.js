const Product = require("../../models/productModel");

const publicProduct= async (req,res)=>{
    const {productId} = req.query;
    try {

        if(productId){
            const product = await Product.findById(productId);
            if(product.isActive == false) return res.status(200).json({message: "Product is deactived"});
            // const fileUrl = `${req.protocol}://${req.get('host')}/${product.image}`;
            const fileUrl = 'https://picsum.photos/200/300';
            product.image = fileUrl;
            return res.status(200).json({data: product, message: "Product fetch successfully" });
        }
        
        const products = await Product.find({isActive: true});
        if(products.length == 0) return res.status(200).json({message: "No Products Found"});

        for(let i=0; i<products.length; i++){
            // let fileUrl = `${req.protocol}://${req.get('host')}/${products[i].image}`;
            const fileUrl = 'https://picsum.photos/200/300';
            products[i].image = fileUrl;
        }
        return res.status(200).json({data: products, message: "Product fetch successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

module.exports = {publicProduct}