const Product = require("../../models/productModel");


const addProduct = async(req,res)=>{
    let { title, parentCommission, grandParentCommission, price, description } = req.body;
    const file = req.file;
    try {
      parentCommission = parentCommission/100;
      grandParentCommission = grandParentCommission/100;
      const product = new Product({ title, parentCommission, grandParentCommission, price, description, image: file.path });
      await product.save();
      res.status(201).json({message: "Product added successfully"});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  const getProduct= async (req,res)=>{
    const {productId} = req.query;
    try {

        if(productId){
            const product = await Product.findById(productId);
            // const fileUrl = `${req.protocol}://${req.get('host')}/${product.image}`;
            const fileUrl = 'https://picsum.photos/200/300';
            product.image = fileUrl;
            return res.status(200).json({data: product, message: "Product fetch successful"});
        }
 
        const products = products = await Product.find();
        if(products.length == 0) return res.status(200).json({message: "No product found"});

        for(let i=0; i<products.length; i++){
            // let fileUrl = `${req.protocol}://${req.get('host')}/${products[i].image}`;
            const fileUrl = 'https://picsum.photos/200/300';
            products[i].image = fileUrl;
        }
        return res.status(200).json({data: products, message: "Product fetch successful"});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
}


module.exports = {addProduct, getProduct}