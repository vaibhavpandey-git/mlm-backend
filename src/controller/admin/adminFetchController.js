const Order = require("../../models/orderModel");
const Payment = require("../../models/paymentModel");
const Support = require("../../models/supportModel");
const User = require("../../models/userModel");
const Withdrawal = require("../../models/withdrawalModel");


const fetchUsers= async (req,res)=>{
    const { userId, isUser , iskyc} = req.query;

    const validKycStatuses = ['Pending', 'Rejected', 'Verified'];
  try {
    // If no query string, return all users
    if (!userId && !isUser && !iskyc) {
      const users = await User.find();
      if(users.length == 0) return res.status(404).json({message: "No user found"});

      for(let i=0; i< users.length; i++){
        delete users[i].password
        delete users[i].tempParent
        delete users[i].canBuy
        delete users[i].canRefer
        delete users[i].token
      }

      return res.status(200).json(users);
    }

    //If userId is provided, return the specific user
    else if (userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
        delete user.password
        delete user.tempParent
        delete user.canBuy
        delete user.canRefer
        delete user.token

      return res.json(user);
    }

    //If isUser is provided, return active or inactive users
    else if (isUser) {
      let isActive;
      if (isUser.toLowerCase() === 'active') {
        isActive = true;
      } else if (isUser.toLowerCase() === 'inactive') {
        isActive = false;
      } else {
        return res.status(400).json({ message: 'Invalid isUser value. Use "active" or "inactive".' });
      }

      //isUser users based on the last product's isActive status
      const users = await User.find({
        products: { $exists: true, $ne: [] },
        $expr: { $eq: [{ $arrayElemAt: ['$products.isActive', -1] }, isActive] }
      });
      if(users.length == 0) return res.status(404).json(message: "No user found with specified filter");
      for(let i=0; i< users.length; i++){
        delete users[i].password
        delete users[i].tempParent
        delete users[i].canBuy
        delete users[i].canRefer
        delete users[i].token
      }

      return res.status(200).json(users);
    }
    else if (iskyc) {

      let filter = {};

      if (!validKycStatuses.includes(iskyc)) {
          return res.status(400).json({
              success: false,
              message: 'Invalid KYC status provided. Allowed values are Pending, Rejected, Verified.'
          });
      }
      // Filter users based on KYC status
      filter = { 'kycDetails.kycStatus': iskyc };

      const users = await User.find(filter, { 'personalDetails.name': 1, 'kycDetails': 1, 'role': 1 });

      if (users.length === 0) return res.status(404).json({ success: false, message: 'No users found with the specified KYC status.'});
      for(let i=0; i< users.length; i++){
        delete users[i].password
        delete users[i].tempParent
        delete users[i].canBuy
        delete users[i].canRefer
        delete users[i].token
      }
      return res.status(200).json(users);
    
  }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


const approvedOrders= async(req,res)=>{
  const {orderId, userId} = req.query
  try {
      if(orderId){
          const order = await Order.findById(orderId);
          if(!order) return res.status(404).json({message: "Order not found"});
          return res.status(200).json(order);
      }
      else if(userId){
          const orders = await Order.find({userId: userId});
          if(orders.length == 0) return res.status(404).json({message: "No order found for this user"})
          return res.status(200).json(orders);
      }
      const orders = await Order.find();
      res.status(200).json(orders);
  } catch (error) {
      res.status(500).json({message: error.message});
  }
}


//list of payment requests to start a cycle from user (to buy product)
const paymentRequests= async (req,res)=>{
  const { paymentId } = req.query;
  try {
      if(paymentId){
        const payment = await Payment.findById(paymentId);
        if(!payment) return res.json({message: "No Payment Available"});
        return res.status(200).json(payment);
      }
      const payments = await Payment.find({paymentStatus: "Pending", isRejected: false});
      if(!payments) return res.json({message: "No Payments Available"});

      res.status(200).json({ payments: payments });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


const withdrawals = async (req, res) => {
  const { status, withdrawalId } = req.query;
  try {
    const validStatuses = ["Pending", "Rejected", "Success"];

    let withdrawals

    if(!status && !withdrawalId){
      withdrawals = await Withdrawal.find();
    }
    else if(status && !withdrawalId){
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      withdrawals = await Withdrawal.find({ paymentStatus: status });
      if (!requests || requests.length === 0) return res.status(404).json({ message: "Requests not found" });

    }
    res.status(200).json(withdrawals);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const viewSupport = async (req,res)=>{
  const { userId } = req.query
  try {
      let queries

      if(userId){
          queries = await Support.find({userId: userId});
          return res.status(200).json({success: true, queries});
      }
      
      queries = await Support.find();
      if(queries.length == 0) return res.status(404).json({message: "No queries found"});
      return res.status(200).json({success: true, queries});

  } catch (error) {
      res.status(500).json({success: false, message: error.message});
  }
}



module.exports = {
  fetchUsers,
  approvedOrders,
  paymentRequests,
  withdrawals,
  viewSupport,
};