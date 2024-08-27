const User = require("../../models/userModel");

const memberTree= async(req,res)=>{
    const {userId, orderId} = req.query;
    try {
        const treeData = await treeTraverse(userId, orderId);
        if(!treeData) res.status(200).json({message: "No tree found"});
        return res.status(200).json(treeData);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


const treeTraverse= async(userId, orderId)=>{
    
        const grandParent = await User.findById(userId);
        const grandProduct = grandParent.products.find((product)=> product.orderId == orderId);

        const treeData = {
            name: grandParent.personalData.name,
            phone: grandParent.phone,
            children: []
        }

        for(let i=0; i < grandProduct.referrals.length; i++){
            const parent = await findById(grandProduct.referrals[i].userId);
            treeData.children[i] = {
                name: parent.personalData.name,
                phone: parent.phone,
                children: []
            }
            const parentProduct = parent.products.find((product)=>product.orderId == grandProduct.referrals[i].orderId);
            for(let j=0; j< parentProduct.referrals.length; j++){
                const child = await User.findById(parentProduct.referrals[i].userId);
                treeData.children[i].children[j] = {
                    name: child.personalData.name,
                    phone: child.phone,
                    children: []
                }
            }
        }

        return treeData;
}

module.exports = {memberTree}